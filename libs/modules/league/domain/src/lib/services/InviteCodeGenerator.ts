import { randomInt } from 'crypto';

import { INVITE_CODE_ALPHABET, INVITE_CODE_LENGTH } from '../constants';
import { InviteCode } from '../types';

export class InviteCodeGenerator {
  static generate(): InviteCode {
    return Array.from(
      { length: INVITE_CODE_LENGTH },
      () => INVITE_CODE_ALPHABET[randomInt(INVITE_CODE_ALPHABET.length)],
    ).join('');
  }
}
