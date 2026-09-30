import { RaceNotFoundError } from './RaceNotFoundError';

describe('RaceNotFoundError', () => {
  it('has a readable message', () => {
    expect(new RaceNotFoundError().message).toBe('Race not found');
  });
});
