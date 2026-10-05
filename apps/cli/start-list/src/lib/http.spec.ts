import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { type FetchLike, HttpClient, HttpError, USER_AGENT } from './http';

function response(status: number, body = '') {
  return { ok: status >= 200 && status < 300, status, text: async () => body };
}

describe('HttpClient', () => {
  let cacheDir: string;

  beforeEach(async () => {
    cacheDir = await mkdtemp(join(tmpdir(), 'start-list-test-'));
  });

  afterEach(async () => {
    await rm(cacheDir, { recursive: true, force: true });
  });

  function createClient(
    fetchImpl: FetchLike,
    sleep = jest.fn(async () => undefined),
    now = () => 1000,
  ) {
    const client = new HttpClient({
      fetchImpl,
      cacheDir,
      delayInMs: 250,
      retries: 2,
      sleep,
      now,
      log: () => undefined,
    });
    return { client, sleep };
  }

  it('identifies itself and caches the responses on disk', async () => {
    const fetchImpl = jest.fn<ReturnType<FetchLike>, Parameters<FetchLike>>(
      async () => response(200, '{"a":1}'),
    );
    const { client } = createClient(fetchImpl);
    await client.prepare();
    expect(
      await client.getJson('https://example.org/a', { 'X-Tenant': 't' }),
    ).toEqual({ a: 1 });
    expect(
      await client.getJson('https://example.org/a', { 'X-Tenant': 't' }),
    ).toEqual({ a: 1 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0]?.[1].headers).toMatchObject({
      'User-Agent': USER_AGENT,
      'X-Tenant': 't',
    });
    expect(await readdir(cacheDir)).toHaveLength(1);
    expect(client.requestCount).toBe(1);
  });

  it('waits between requests and retries 429, 5xx and network errors', async () => {
    let calls = 0;
    const fetchImpl: FetchLike = async () => {
      calls += 1;
      if (calls === 1) {
        return response(429);
      }
      if (calls === 2) {
        throw new Error('reset');
      }
      return response(200, 'ok');
    };
    const { client, sleep } = createClient(fetchImpl);
    expect(await client.getText('https://example.org/b')).toBe('ok');
    expect(calls).toBe(3);
    expect(sleep).toHaveBeenCalledWith(1000);
    expect(sleep).toHaveBeenCalledWith(2000);
    expect(sleep).toHaveBeenCalledWith(250);
  });

  it('gives up on client errors and after the last retry', async () => {
    const { client } = createClient(async () => response(404));
    await expect(
      client.getText('https://example.org/c'),
    ).rejects.toBeInstanceOf(HttpError);
    const failing = createClient(async () => response(503)).client;
    await expect(failing.getText('https://example.org/d')).rejects.toThrow(
      'HTTP 503',
    );
    const broken = createClient(async () => {
      throw new Error('offline');
    }).client;
    await expect(broken.getText('https://example.org/e')).rejects.toThrow(
      'offline',
    );
  });

  it('works without cache', async () => {
    const client = new HttpClient({
      fetchImpl: async () => response(200, 'x'),
      cacheDir: null,
      delayInMs: 0,
      retries: 0,
      sleep: async () => undefined,
      now: () => 0,
      log: () => undefined,
    });
    await client.prepare();
    expect(await client.getText('https://example.org/f')).toBe('x');
  });
});
