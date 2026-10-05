import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const USER_AGENT = 'FantrailStartList/0.1 (private friends game)';

export type FetchResponse = {
  ok: boolean;
  status: number;
  text(): Promise<string>;
};

export type FetchLike = (
  url: string,
  init: { headers: Record<string, string> },
) => Promise<FetchResponse>;

export type HttpClientOptions = {
  fetchImpl: FetchLike;
  /** Responses are kept on disk so a rerun sends no request. */
  cacheDir: string | null;
  delayInMs: number;
  retries: number;
  sleep: (ms: number) => Promise<void>;
  now: () => number;
  log: (message: string) => void;
};

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly url: string,
  ) {
    super(`HTTP ${status} on ${url}`);
  }
}

function isRetryable(status: number): boolean {
  return status === 429 || status >= 500;
}

/** One request at a time, a pause between requests, backoff on 429 and 5xx. */
export class HttpClient {
  private _lastRequestAt = Number.NEGATIVE_INFINITY;
  private _requestCount = 0;

  constructor(private readonly _options: HttpClientOptions) {}

  get requestCount(): number {
    return this._requestCount;
  }

  async getText(
    url: string,
    headers: Record<string, string> = {},
  ): Promise<string> {
    const cachePath = this._cachePath(url, headers);
    const cached = cachePath ? await this._readCache(cachePath) : null;
    if (cached !== null) {
      return cached;
    }
    const body = await this._fetchWithRetries(url, headers);
    if (cachePath) {
      await writeFile(cachePath, body, 'utf8');
    }
    return body;
  }

  async getJson(
    url: string,
    headers: Record<string, string> = {},
  ): Promise<unknown> {
    return JSON.parse(
      await this.getText(url, { Accept: 'application/json', ...headers }),
    );
  }

  private async _fetchWithRetries(
    url: string,
    headers: Record<string, string>,
  ): Promise<string> {
    for (let attempt = 0; ; attempt += 1) {
      await this._throttle();
      this._requestCount += 1;
      try {
        const response = await this._options.fetchImpl(url, {
          headers: { 'User-Agent': USER_AGENT, ...headers },
        });
        if (response.ok) {
          return await response.text();
        }
        if (!isRetryable(response.status) || attempt >= this._options.retries) {
          throw new HttpError(response.status, url);
        }
        this._options.log(`HTTP ${response.status}, nouvel essai : ${url}`);
      } catch (error) {
        if (error instanceof HttpError || attempt >= this._options.retries) {
          throw error;
        }
        this._options.log(`Erreur réseau, nouvel essai : ${url}`);
      }
      await this._options.sleep(
        Math.max(1000, this._options.delayInMs) * 2 ** attempt,
      );
    }
  }

  private async _throttle(): Promise<void> {
    const wait =
      this._lastRequestAt + this._options.delayInMs - this._options.now();
    if (wait > 0) {
      await this._options.sleep(wait);
    }
    this._lastRequestAt = this._options.now();
  }

  private _cachePath(
    url: string,
    headers: Record<string, string>,
  ): string | null {
    if (!this._options.cacheDir) {
      return null;
    }
    const key = createHash('sha256')
      .update(`${url}\n${JSON.stringify(headers)}`)
      .digest('hex');
    return join(this._options.cacheDir, `${key}.txt`);
  }

  private async _readCache(path: string): Promise<string | null> {
    try {
      return await readFile(path, 'utf8');
    } catch {
      return null;
    }
  }

  async prepare(): Promise<void> {
    if (this._options.cacheDir) {
      await mkdir(this._options.cacheDir, { recursive: true });
    }
  }
}
