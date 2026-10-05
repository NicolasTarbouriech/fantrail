import { z } from 'zod';

import { type ApiFetchLike, FantrailApi } from './fantrailApi';

function response(status: number, body: unknown) {
  return {
    ok: status < 400,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  };
}

describe('FantrailApi', () => {
  function build(fetchImpl: ApiFetchLike) {
    return new FantrailApi({
      url: 'https://api.example.com/graphql',
      apiKey: 'secret',
      fetchImpl,
      sleep: jest.fn().mockResolvedValue(undefined),
      log: jest.fn(),
    });
  }

  it('sends the query with the admin key and parses the data', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(response(200, { data: { ok: true } }));
    const data = await build(fetchImpl).request(
      'query { ok }',
      { a: 1 },
      z.object({ ok: z.boolean() }),
    );
    expect(data).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledWith('https://api.example.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': 'secret' },
      body: JSON.stringify({ query: 'query { ok }', variables: { a: 1 } }),
    });
  });

  it('throws the GraphQL errors and the HTTP failures', async () => {
    await expect(
      build(
        jest
          .fn()
          .mockResolvedValue(
            response(200, { errors: [{ message: 'Forbidden' }] }),
          ),
      ).request('q', {}, z.unknown()),
    ).rejects.toThrow('Forbidden');
    await expect(
      build(jest.fn().mockResolvedValue(response(502, {}))).request(
        'q',
        {},
        z.unknown(),
      ),
    ).rejects.toThrow('HTTP 502');
  });

  it('waits for a sleeping API to wake up, then gives up', async () => {
    const fetchImpl = jest
      .fn()
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce(response(503, {}))
      .mockResolvedValueOnce(response(200, {}));
    await build(fetchImpl).waitUntilAwake();
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(fetchImpl).toHaveBeenCalledWith('https://api.example.com/health', {
      method: 'GET',
      headers: {},
    });
    await expect(
      build(jest.fn().mockResolvedValue(response(503, {}))).waitUntilAwake(),
    ).rejects.toThrow("L'API ne répond pas");
  });
});
