import { DurationInSeconds } from '../types';

export class TimeScore {
  constructor(
    public readonly estimateInSeconds: DurationInSeconds,
    public readonly actualInSeconds: DurationInSeconds,
    public readonly toleranceInSeconds: number,
    public readonly points: number,
  ) {}

  get gapInSeconds(): number {
    return Math.abs(this.estimateInSeconds - this.actualInSeconds);
  }
}
