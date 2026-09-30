import { RaceStatus } from '../enums';
import { RaceNotEditableError, RaceStatusTransitionError } from '../errors';
import { RaceStatusAssertion } from './RaceStatusAssertion';

describe('RaceStatusAssertion', () => {
  it.each([
    [RaceStatus.Draft, RaceStatus.Open],
    [RaceStatus.Open, RaceStatus.Locked],
    [RaceStatus.Open, RaceStatus.Scored],
    [RaceStatus.Locked, RaceStatus.Scored],
    [RaceStatus.Locked, RaceStatus.Cancelled],
  ])('allows %s to %s', (from, to) => {
    expect(() => RaceStatusAssertion.assertTransition(from, to)).not.toThrow();
  });

  it.each([
    [RaceStatus.Draft, RaceStatus.Scored],
    [RaceStatus.Scored, RaceStatus.Open],
    [RaceStatus.Cancelled, RaceStatus.Open],
    [RaceStatus.Locked, RaceStatus.Open],
  ])('rejects %s to %s', (from, to) => {
    expect(() => RaceStatusAssertion.assertTransition(from, to)).toThrow(
      RaceStatusTransitionError,
    );
  });

  it('allows edition while draft or open only', () => {
    expect(() =>
      RaceStatusAssertion.assertEditable(RaceStatus.Draft),
    ).not.toThrow();
    expect(() =>
      RaceStatusAssertion.assertEditable(RaceStatus.Open),
    ).not.toThrow();
    expect(() => RaceStatusAssertion.assertEditable(RaceStatus.Locked)).toThrow(
      RaceNotEditableError,
    );
  });
});
