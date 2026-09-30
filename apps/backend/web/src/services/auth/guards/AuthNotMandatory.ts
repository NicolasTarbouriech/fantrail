import { SetMetadata } from '@nestjs/common';

export const AUTH_NOT_MANDATORY_KEY = 'authNotMandatory';

export const AuthNotMandatory = () => SetMetadata(AUTH_NOT_MANDATORY_KEY, true);
