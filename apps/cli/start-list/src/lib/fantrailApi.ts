import { z } from 'zod';

export type ApiFetchLike = (
  url: string,
  init: {
    method: 'GET' | 'POST';
    headers: Record<string, string>;
    body?: string;
  },
) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

export type FantrailApiOptions = {
  /** GraphQL endpoint, e.g. https://fantrail-api.onrender.com/graphql */
  url: string;
  apiKey: string;
  fetchImpl: ApiFetchLike;
  sleep: (ms: number) => Promise<void>;
  log: (message: string) => void;
};

const GraphQLResponse = z.object({
  data: z.unknown().nullish(),
  errors: z.array(z.object({ message: z.string() })).nullish(),
});

// A free Render instance sleeps after 15 minutes and takes about a minute to wake up.
const WAKE_UP_ATTEMPTS = 18;
const WAKE_UP_PAUSE_IN_MS = 10_000;

/** The admin GraphQL API of Fantrail, authenticated by the admin api key. */
export class FantrailApi {
  constructor(private readonly _options: FantrailApiOptions) {}

  async waitUntilAwake(): Promise<void> {
    const healthUrl = new URL('/health', this._options.url).toString();
    for (let attempt = 1; ; attempt += 1) {
      try {
        const response = await this._options.fetchImpl(healthUrl, {
          method: 'GET',
          headers: {},
        });
        if (response.ok) {
          return;
        }
      } catch {
        // Still waking up.
      }
      if (attempt >= WAKE_UP_ATTEMPTS) {
        throw new Error(`L'API ne répond pas : ${healthUrl}`);
      }
      this._options.log(`API endormie, nouvel essai (${attempt})…`);
      await this._options.sleep(WAKE_UP_PAUSE_IN_MS);
    }
  }

  async request<T>(
    query: string,
    variables: Record<string, unknown>,
    schema: z.ZodType<T>,
  ): Promise<T> {
    const response = await this._options.fetchImpl(this._options.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this._options.apiKey,
      },
      body: JSON.stringify({ query, variables }),
    });
    const body = GraphQLResponse.parse(JSON.parse(await response.text()));
    if (body.errors?.length) {
      throw new Error(body.errors.map(({ message }) => message).join(' ; '));
    }
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} sur ${this._options.url}`);
    }
    return schema.parse(body.data);
  }
}
