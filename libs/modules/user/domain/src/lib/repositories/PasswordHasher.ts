import { PlainPassword } from '../types';

export abstract class PasswordHasher {
  abstract hash(password: PlainPassword): Promise<string>;
  abstract verify(password: string, passwordHash: string): Promise<boolean>;
}
