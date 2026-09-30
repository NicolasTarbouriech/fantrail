import { PasswordHasher, UserRepository } from '@trail/modules/user/domain';

import { UserInfrastructureModule } from './UserInfrastructureModule';
import { BcryptPasswordHasher } from './repositories/BcryptPasswordHasher';
import { TypeormUserRepository } from './repositories/TypeormUserRepository';

describe('UserInfrastructureModule', () => {
  it('binds every domain port to its implementation', () => {
    const { providers, exports } = UserInfrastructureModule.register();
    const expected = [
      { provide: UserRepository, useClass: TypeormUserRepository },
      { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    ];
    expect(providers).toEqual(expected);
    expect(exports).toEqual(expected);
  });
});
