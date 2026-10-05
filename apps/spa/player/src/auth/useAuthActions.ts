import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

import type { RegisterInput } from '@trail/shared/apps/backend/web/data-access-graphql-types';

import {
  RequireAuthDocument,
  type RequireAuthQuery,
  useUseAuthActionsMutateLoginMutation,
  useUseAuthActionsMutateLogoutMutation,
  useUseAuthActionsMutateRegisterMutation,
} from '../services/graphql';

export function useAuthActions() {
  const client = useApolloClient();
  const [loginMutation, loginState] = useUseAuthActionsMutateLoginMutation();
  const [registerMutation, registerState] =
    useUseAuthActionsMutateRegisterMutation();
  const [logoutMutation] = useUseAuthActionsMutateLogoutMutation();

  const storeMe = useCallback(
    (me: RequireAuthQuery['me']) =>
      client.writeQuery({ query: RequireAuthDocument, data: { me } }),
    [client],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await loginMutation({ variables: { email, password } });
      storeMe(data?.login ?? null);
    },
    [loginMutation, storeMe],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const { data } = await registerMutation({ variables: { data: input } });
      storeMe(data?.register ?? null);
    },
    [registerMutation, storeMe],
  );

  const logout = useCallback(async () => {
    await logoutMutation();
    await client.clearStore();
    storeMe(null);
  }, [client, logoutMutation, storeMe]);

  return {
    login,
    register,
    logout,
    isSubmitting: loginState.loading || registerState.loading,
  };
}
