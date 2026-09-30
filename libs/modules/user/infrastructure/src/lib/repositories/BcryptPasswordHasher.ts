import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { PasswordHasher, PlainPassword } from '@trail/modules/user/domain';

const COST = 10;

@Injectable()
export class BcryptPasswordHasher extends PasswordHasher {
  async hash(password: PlainPassword): Promise<string> {
    return hash(PlainPassword.parse(password), COST);
  }

  verify(password: string, passwordHash: string): Promise<boolean> {
    return compare(password, passwordHash);
  }
}
