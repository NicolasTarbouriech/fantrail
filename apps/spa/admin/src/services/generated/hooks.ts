import * as Types from './operations';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export const RacePageRunnerFragmentDoc = gql`
    fragment RacePageRunner on Runner {
  id
  firstName
  lastName
  fullName
  nationality
  index
  indexSource
  utmbUrl
  itraUrl
  isWithdrawn
  withdrawnAt
  favoriteRank
}
    `;
export const RacePageRaceFragmentDoc = gql`
    fragment RacePageRace on Race {
  id
  name
  location
  distanceInKm
  elevationGainInMeters
  timezone
  websiteUrl
  liveTrailUrl
  pickCount
  timeTolerancePercent
  status
  fields {
    id
    gender
    startAt
    lockAt
    lockedAt
    isLocked
    startList {
      fieldId
      runners {
        ...RacePageRunner
      }
    }
    result {
      fieldId
      version
      rankingList
      winnerTimeInSeconds
      publishedAt
    }
  }
}
    ${RacePageRunnerFragmentDoc}`;
export const RequireAdminDocument = gql`
    query RequireAdmin {
  me {
    id
    email
    pseudo
    role
  }
}
    `;

/**
 * __useRequireAdminQuery__
 *
 * To run a query within a React component, call `useRequireAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequireAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequireAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useRequireAdminQuery(baseOptions?: Apollo.QueryHookOptions<Types.RequireAdminQuery, Types.RequireAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.RequireAdminQuery, Types.RequireAdminQueryVariables>(RequireAdminDocument, options);
      }
export function useRequireAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.RequireAdminQuery, Types.RequireAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.RequireAdminQuery, Types.RequireAdminQueryVariables>(RequireAdminDocument, options);
        }
export function useRequireAdminSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.RequireAdminQuery, Types.RequireAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.RequireAdminQuery, Types.RequireAdminQueryVariables>(RequireAdminDocument, options);
        }
export type RequireAdminQueryHookResult = ReturnType<typeof useRequireAdminQuery>;
export type RequireAdminLazyQueryHookResult = ReturnType<typeof useRequireAdminLazyQuery>;
export type RequireAdminSuspenseQueryHookResult = ReturnType<typeof useRequireAdminSuspenseQuery>;
export type RequireAdminQueryResult = Apollo.QueryResult<Types.RequireAdminQuery, Types.RequireAdminQueryVariables>;
export const RequireAdminMutateLogoutDocument = gql`
    mutation RequireAdminMutateLogout {
  logout
}
    `;
export type RequireAdminMutateLogoutMutationFn = Apollo.MutationFunction<Types.RequireAdminMutateLogoutMutation, Types.RequireAdminMutateLogoutMutationVariables>;

/**
 * __useRequireAdminMutateLogoutMutation__
 *
 * To run a mutation, you first call `useRequireAdminMutateLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequireAdminMutateLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requireAdminMutateLogoutMutation, { data, loading, error }] = useRequireAdminMutateLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useRequireAdminMutateLogoutMutation(baseOptions?: Apollo.MutationHookOptions<Types.RequireAdminMutateLogoutMutation, Types.RequireAdminMutateLogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RequireAdminMutateLogoutMutation, Types.RequireAdminMutateLogoutMutationVariables>(RequireAdminMutateLogoutDocument, options);
      }
export type RequireAdminMutateLogoutMutationHookResult = ReturnType<typeof useRequireAdminMutateLogoutMutation>;
export type RequireAdminMutateLogoutMutationResult = Apollo.MutationResult<Types.RequireAdminMutateLogoutMutation>;
export type RequireAdminMutateLogoutMutationOptions = Apollo.BaseMutationOptions<Types.RequireAdminMutateLogoutMutation, Types.RequireAdminMutateLogoutMutationVariables>;
export const LoginPageMutateLoginDocument = gql`
    mutation LoginPageMutateLogin($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    email
    pseudo
    role
  }
}
    `;
export type LoginPageMutateLoginMutationFn = Apollo.MutationFunction<Types.LoginPageMutateLoginMutation, Types.LoginPageMutateLoginMutationVariables>;

/**
 * __useLoginPageMutateLoginMutation__
 *
 * To run a mutation, you first call `useLoginPageMutateLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginPageMutateLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginPageMutateLoginMutation, { data, loading, error }] = useLoginPageMutateLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginPageMutateLoginMutation(baseOptions?: Apollo.MutationHookOptions<Types.LoginPageMutateLoginMutation, Types.LoginPageMutateLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LoginPageMutateLoginMutation, Types.LoginPageMutateLoginMutationVariables>(LoginPageMutateLoginDocument, options);
      }
export type LoginPageMutateLoginMutationHookResult = ReturnType<typeof useLoginPageMutateLoginMutation>;
export type LoginPageMutateLoginMutationResult = Apollo.MutationResult<Types.LoginPageMutateLoginMutation>;
export type LoginPageMutateLoginMutationOptions = Apollo.BaseMutationOptions<Types.LoginPageMutateLoginMutation, Types.LoginPageMutateLoginMutationVariables>;
export const LeaguePageDocument = gql`
    query LeaguePage($leagueId: ID!) {
  league(leagueId: $leagueId) {
    id
    name
    visibility
    memberCount
    ownerId
    inviteCode
    createdAt
    members {
      id
      pseudo
    }
    leaderboard {
      rank
      userId
      total
    }
  }
}
    `;

/**
 * __useLeaguePageQuery__
 *
 * To run a query within a React component, call `useLeaguePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useLeaguePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLeaguePageQuery({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *   },
 * });
 */
export function useLeaguePageQuery(baseOptions: Apollo.QueryHookOptions<Types.LeaguePageQuery, Types.LeaguePageQueryVariables> & ({ variables: Types.LeaguePageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.LeaguePageQuery, Types.LeaguePageQueryVariables>(LeaguePageDocument, options);
      }
export function useLeaguePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.LeaguePageQuery, Types.LeaguePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.LeaguePageQuery, Types.LeaguePageQueryVariables>(LeaguePageDocument, options);
        }
export function useLeaguePageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.LeaguePageQuery, Types.LeaguePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.LeaguePageQuery, Types.LeaguePageQueryVariables>(LeaguePageDocument, options);
        }
export type LeaguePageQueryHookResult = ReturnType<typeof useLeaguePageQuery>;
export type LeaguePageLazyQueryHookResult = ReturnType<typeof useLeaguePageLazyQuery>;
export type LeaguePageSuspenseQueryHookResult = ReturnType<typeof useLeaguePageSuspenseQuery>;
export type LeaguePageQueryResult = Apollo.QueryResult<Types.LeaguePageQuery, Types.LeaguePageQueryVariables>;
export const LeaguePageMutateRenameDocument = gql`
    mutation LeaguePageMutateRename($leagueId: ID!, $name: String!) {
  renameLeague(leagueId: $leagueId, name: $name) {
    id
    name
  }
}
    `;
export type LeaguePageMutateRenameMutationFn = Apollo.MutationFunction<Types.LeaguePageMutateRenameMutation, Types.LeaguePageMutateRenameMutationVariables>;

/**
 * __useLeaguePageMutateRenameMutation__
 *
 * To run a mutation, you first call `useLeaguePageMutateRenameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaguePageMutateRenameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaguePageMutateRenameMutation, { data, loading, error }] = useLeaguePageMutateRenameMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useLeaguePageMutateRenameMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeaguePageMutateRenameMutation, Types.LeaguePageMutateRenameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeaguePageMutateRenameMutation, Types.LeaguePageMutateRenameMutationVariables>(LeaguePageMutateRenameDocument, options);
      }
export type LeaguePageMutateRenameMutationHookResult = ReturnType<typeof useLeaguePageMutateRenameMutation>;
export type LeaguePageMutateRenameMutationResult = Apollo.MutationResult<Types.LeaguePageMutateRenameMutation>;
export type LeaguePageMutateRenameMutationOptions = Apollo.BaseMutationOptions<Types.LeaguePageMutateRenameMutation, Types.LeaguePageMutateRenameMutationVariables>;
export const LeaguePageMutateRemoveMemberDocument = gql`
    mutation LeaguePageMutateRemoveMember($leagueId: ID!, $userId: ID!) {
  removeLeagueMember(leagueId: $leagueId, userId: $userId) {
    id
    memberCount
    members {
      id
      pseudo
    }
  }
}
    `;
export type LeaguePageMutateRemoveMemberMutationFn = Apollo.MutationFunction<Types.LeaguePageMutateRemoveMemberMutation, Types.LeaguePageMutateRemoveMemberMutationVariables>;

/**
 * __useLeaguePageMutateRemoveMemberMutation__
 *
 * To run a mutation, you first call `useLeaguePageMutateRemoveMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaguePageMutateRemoveMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaguePageMutateRemoveMemberMutation, { data, loading, error }] = useLeaguePageMutateRemoveMemberMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useLeaguePageMutateRemoveMemberMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeaguePageMutateRemoveMemberMutation, Types.LeaguePageMutateRemoveMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeaguePageMutateRemoveMemberMutation, Types.LeaguePageMutateRemoveMemberMutationVariables>(LeaguePageMutateRemoveMemberDocument, options);
      }
export type LeaguePageMutateRemoveMemberMutationHookResult = ReturnType<typeof useLeaguePageMutateRemoveMemberMutation>;
export type LeaguePageMutateRemoveMemberMutationResult = Apollo.MutationResult<Types.LeaguePageMutateRemoveMemberMutation>;
export type LeaguePageMutateRemoveMemberMutationOptions = Apollo.BaseMutationOptions<Types.LeaguePageMutateRemoveMemberMutation, Types.LeaguePageMutateRemoveMemberMutationVariables>;
export const LeaguePageMutateDeleteDocument = gql`
    mutation LeaguePageMutateDelete($leagueId: ID!) {
  deleteLeague(leagueId: $leagueId)
}
    `;
export type LeaguePageMutateDeleteMutationFn = Apollo.MutationFunction<Types.LeaguePageMutateDeleteMutation, Types.LeaguePageMutateDeleteMutationVariables>;

/**
 * __useLeaguePageMutateDeleteMutation__
 *
 * To run a mutation, you first call `useLeaguePageMutateDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaguePageMutateDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaguePageMutateDeleteMutation, { data, loading, error }] = useLeaguePageMutateDeleteMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *   },
 * });
 */
export function useLeaguePageMutateDeleteMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeaguePageMutateDeleteMutation, Types.LeaguePageMutateDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeaguePageMutateDeleteMutation, Types.LeaguePageMutateDeleteMutationVariables>(LeaguePageMutateDeleteDocument, options);
      }
export type LeaguePageMutateDeleteMutationHookResult = ReturnType<typeof useLeaguePageMutateDeleteMutation>;
export type LeaguePageMutateDeleteMutationResult = Apollo.MutationResult<Types.LeaguePageMutateDeleteMutation>;
export type LeaguePageMutateDeleteMutationOptions = Apollo.BaseMutationOptions<Types.LeaguePageMutateDeleteMutation, Types.LeaguePageMutateDeleteMutationVariables>;
export const LeaguesPageDocument = gql`
    query LeaguesPage {
  adminLeagues {
    id
    name
    visibility
    memberCount
    ownerId
    createdAt
    members {
      id
      pseudo
    }
  }
}
    `;

/**
 * __useLeaguesPageQuery__
 *
 * To run a query within a React component, call `useLeaguesPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useLeaguesPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLeaguesPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useLeaguesPageQuery(baseOptions?: Apollo.QueryHookOptions<Types.LeaguesPageQuery, Types.LeaguesPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.LeaguesPageQuery, Types.LeaguesPageQueryVariables>(LeaguesPageDocument, options);
      }
export function useLeaguesPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.LeaguesPageQuery, Types.LeaguesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.LeaguesPageQuery, Types.LeaguesPageQueryVariables>(LeaguesPageDocument, options);
        }
export function useLeaguesPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.LeaguesPageQuery, Types.LeaguesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.LeaguesPageQuery, Types.LeaguesPageQueryVariables>(LeaguesPageDocument, options);
        }
export type LeaguesPageQueryHookResult = ReturnType<typeof useLeaguesPageQuery>;
export type LeaguesPageLazyQueryHookResult = ReturnType<typeof useLeaguesPageLazyQuery>;
export type LeaguesPageSuspenseQueryHookResult = ReturnType<typeof useLeaguesPageSuspenseQuery>;
export type LeaguesPageQueryResult = Apollo.QueryResult<Types.LeaguesPageQuery, Types.LeaguesPageQueryVariables>;
export const PlayersPageDocument = gql`
    query PlayersPage {
  adminUsers {
    id
    email
    pseudo
    role
    disabledAt
    createdAt
  }
}
    `;

/**
 * __usePlayersPageQuery__
 *
 * To run a query within a React component, call `usePlayersPageQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayersPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayersPageQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlayersPageQuery(baseOptions?: Apollo.QueryHookOptions<Types.PlayersPageQuery, Types.PlayersPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.PlayersPageQuery, Types.PlayersPageQueryVariables>(PlayersPageDocument, options);
      }
export function usePlayersPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.PlayersPageQuery, Types.PlayersPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.PlayersPageQuery, Types.PlayersPageQueryVariables>(PlayersPageDocument, options);
        }
export function usePlayersPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.PlayersPageQuery, Types.PlayersPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.PlayersPageQuery, Types.PlayersPageQueryVariables>(PlayersPageDocument, options);
        }
export type PlayersPageQueryHookResult = ReturnType<typeof usePlayersPageQuery>;
export type PlayersPageLazyQueryHookResult = ReturnType<typeof usePlayersPageLazyQuery>;
export type PlayersPageSuspenseQueryHookResult = ReturnType<typeof usePlayersPageSuspenseQuery>;
export type PlayersPageQueryResult = Apollo.QueryResult<Types.PlayersPageQuery, Types.PlayersPageQueryVariables>;
export const PlayersPageMutateDisableDocument = gql`
    mutation PlayersPageMutateDisable($userId: ID!) {
  disableUser(userId: $userId) {
    id
    disabledAt
  }
}
    `;
export type PlayersPageMutateDisableMutationFn = Apollo.MutationFunction<Types.PlayersPageMutateDisableMutation, Types.PlayersPageMutateDisableMutationVariables>;

/**
 * __usePlayersPageMutateDisableMutation__
 *
 * To run a mutation, you first call `usePlayersPageMutateDisableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayersPageMutateDisableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playersPageMutateDisableMutation, { data, loading, error }] = usePlayersPageMutateDisableMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function usePlayersPageMutateDisableMutation(baseOptions?: Apollo.MutationHookOptions<Types.PlayersPageMutateDisableMutation, Types.PlayersPageMutateDisableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.PlayersPageMutateDisableMutation, Types.PlayersPageMutateDisableMutationVariables>(PlayersPageMutateDisableDocument, options);
      }
export type PlayersPageMutateDisableMutationHookResult = ReturnType<typeof usePlayersPageMutateDisableMutation>;
export type PlayersPageMutateDisableMutationResult = Apollo.MutationResult<Types.PlayersPageMutateDisableMutation>;
export type PlayersPageMutateDisableMutationOptions = Apollo.BaseMutationOptions<Types.PlayersPageMutateDisableMutation, Types.PlayersPageMutateDisableMutationVariables>;
export const PlayersPageMutateEnableDocument = gql`
    mutation PlayersPageMutateEnable($userId: ID!) {
  enableUser(userId: $userId) {
    id
    disabledAt
  }
}
    `;
export type PlayersPageMutateEnableMutationFn = Apollo.MutationFunction<Types.PlayersPageMutateEnableMutation, Types.PlayersPageMutateEnableMutationVariables>;

/**
 * __usePlayersPageMutateEnableMutation__
 *
 * To run a mutation, you first call `usePlayersPageMutateEnableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayersPageMutateEnableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playersPageMutateEnableMutation, { data, loading, error }] = usePlayersPageMutateEnableMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function usePlayersPageMutateEnableMutation(baseOptions?: Apollo.MutationHookOptions<Types.PlayersPageMutateEnableMutation, Types.PlayersPageMutateEnableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.PlayersPageMutateEnableMutation, Types.PlayersPageMutateEnableMutationVariables>(PlayersPageMutateEnableDocument, options);
      }
export type PlayersPageMutateEnableMutationHookResult = ReturnType<typeof usePlayersPageMutateEnableMutation>;
export type PlayersPageMutateEnableMutationResult = Apollo.MutationResult<Types.PlayersPageMutateEnableMutation>;
export type PlayersPageMutateEnableMutationOptions = Apollo.BaseMutationOptions<Types.PlayersPageMutateEnableMutation, Types.PlayersPageMutateEnableMutationVariables>;
export const FieldsTabMutateAddFieldDocument = gql`
    mutation FieldsTabMutateAddField($raceId: ID!, $data: RaceFieldInput!) {
  addRaceField(raceId: $raceId, data: $data) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;
export type FieldsTabMutateAddFieldMutationFn = Apollo.MutationFunction<Types.FieldsTabMutateAddFieldMutation, Types.FieldsTabMutateAddFieldMutationVariables>;

/**
 * __useFieldsTabMutateAddFieldMutation__
 *
 * To run a mutation, you first call `useFieldsTabMutateAddFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFieldsTabMutateAddFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fieldsTabMutateAddFieldMutation, { data, loading, error }] = useFieldsTabMutateAddFieldMutation({
 *   variables: {
 *      raceId: // value for 'raceId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useFieldsTabMutateAddFieldMutation(baseOptions?: Apollo.MutationHookOptions<Types.FieldsTabMutateAddFieldMutation, Types.FieldsTabMutateAddFieldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.FieldsTabMutateAddFieldMutation, Types.FieldsTabMutateAddFieldMutationVariables>(FieldsTabMutateAddFieldDocument, options);
      }
export type FieldsTabMutateAddFieldMutationHookResult = ReturnType<typeof useFieldsTabMutateAddFieldMutation>;
export type FieldsTabMutateAddFieldMutationResult = Apollo.MutationResult<Types.FieldsTabMutateAddFieldMutation>;
export type FieldsTabMutateAddFieldMutationOptions = Apollo.BaseMutationOptions<Types.FieldsTabMutateAddFieldMutation, Types.FieldsTabMutateAddFieldMutationVariables>;
export const FieldsTabMutateUpdateFieldDocument = gql`
    mutation FieldsTabMutateUpdateField($fieldId: ID!, $data: RaceFieldInput!) {
  updateRaceField(fieldId: $fieldId, data: $data) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;
export type FieldsTabMutateUpdateFieldMutationFn = Apollo.MutationFunction<Types.FieldsTabMutateUpdateFieldMutation, Types.FieldsTabMutateUpdateFieldMutationVariables>;

/**
 * __useFieldsTabMutateUpdateFieldMutation__
 *
 * To run a mutation, you first call `useFieldsTabMutateUpdateFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFieldsTabMutateUpdateFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fieldsTabMutateUpdateFieldMutation, { data, loading, error }] = useFieldsTabMutateUpdateFieldMutation({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useFieldsTabMutateUpdateFieldMutation(baseOptions?: Apollo.MutationHookOptions<Types.FieldsTabMutateUpdateFieldMutation, Types.FieldsTabMutateUpdateFieldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.FieldsTabMutateUpdateFieldMutation, Types.FieldsTabMutateUpdateFieldMutationVariables>(FieldsTabMutateUpdateFieldDocument, options);
      }
export type FieldsTabMutateUpdateFieldMutationHookResult = ReturnType<typeof useFieldsTabMutateUpdateFieldMutation>;
export type FieldsTabMutateUpdateFieldMutationResult = Apollo.MutationResult<Types.FieldsTabMutateUpdateFieldMutation>;
export type FieldsTabMutateUpdateFieldMutationOptions = Apollo.BaseMutationOptions<Types.FieldsTabMutateUpdateFieldMutation, Types.FieldsTabMutateUpdateFieldMutationVariables>;
export const FieldsTabMutateLockFieldDocument = gql`
    mutation FieldsTabMutateLockField($fieldId: ID!) {
  lockRaceField(fieldId: $fieldId) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;
export type FieldsTabMutateLockFieldMutationFn = Apollo.MutationFunction<Types.FieldsTabMutateLockFieldMutation, Types.FieldsTabMutateLockFieldMutationVariables>;

/**
 * __useFieldsTabMutateLockFieldMutation__
 *
 * To run a mutation, you first call `useFieldsTabMutateLockFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFieldsTabMutateLockFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fieldsTabMutateLockFieldMutation, { data, loading, error }] = useFieldsTabMutateLockFieldMutation({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *   },
 * });
 */
export function useFieldsTabMutateLockFieldMutation(baseOptions?: Apollo.MutationHookOptions<Types.FieldsTabMutateLockFieldMutation, Types.FieldsTabMutateLockFieldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.FieldsTabMutateLockFieldMutation, Types.FieldsTabMutateLockFieldMutationVariables>(FieldsTabMutateLockFieldDocument, options);
      }
export type FieldsTabMutateLockFieldMutationHookResult = ReturnType<typeof useFieldsTabMutateLockFieldMutation>;
export type FieldsTabMutateLockFieldMutationResult = Apollo.MutationResult<Types.FieldsTabMutateLockFieldMutation>;
export type FieldsTabMutateLockFieldMutationOptions = Apollo.BaseMutationOptions<Types.FieldsTabMutateLockFieldMutation, Types.FieldsTabMutateLockFieldMutationVariables>;
export const FieldsTabMutateAddRunnersDocument = gql`
    mutation FieldsTabMutateAddRunners($fieldId: ID!, $dataList: [RunnerInput!]!) {
  addRunners(fieldId: $fieldId, dataList: $dataList) {
    fieldId
    runners {
      ...RacePageRunner
    }
  }
}
    ${RacePageRunnerFragmentDoc}`;
export type FieldsTabMutateAddRunnersMutationFn = Apollo.MutationFunction<Types.FieldsTabMutateAddRunnersMutation, Types.FieldsTabMutateAddRunnersMutationVariables>;

/**
 * __useFieldsTabMutateAddRunnersMutation__
 *
 * To run a mutation, you first call `useFieldsTabMutateAddRunnersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFieldsTabMutateAddRunnersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fieldsTabMutateAddRunnersMutation, { data, loading, error }] = useFieldsTabMutateAddRunnersMutation({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *      dataList: // value for 'dataList'
 *   },
 * });
 */
export function useFieldsTabMutateAddRunnersMutation(baseOptions?: Apollo.MutationHookOptions<Types.FieldsTabMutateAddRunnersMutation, Types.FieldsTabMutateAddRunnersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.FieldsTabMutateAddRunnersMutation, Types.FieldsTabMutateAddRunnersMutationVariables>(FieldsTabMutateAddRunnersDocument, options);
      }
export type FieldsTabMutateAddRunnersMutationHookResult = ReturnType<typeof useFieldsTabMutateAddRunnersMutation>;
export type FieldsTabMutateAddRunnersMutationResult = Apollo.MutationResult<Types.FieldsTabMutateAddRunnersMutation>;
export type FieldsTabMutateAddRunnersMutationOptions = Apollo.BaseMutationOptions<Types.FieldsTabMutateAddRunnersMutation, Types.FieldsTabMutateAddRunnersMutationVariables>;
export const FieldsTabMutateUpdateRunnerDocument = gql`
    mutation FieldsTabMutateUpdateRunner($fieldId: ID!, $runnerId: ID!, $data: RunnerInput!) {
  updateRunner(fieldId: $fieldId, runnerId: $runnerId, data: $data) {
    fieldId
    runners {
      ...RacePageRunner
    }
  }
}
    ${RacePageRunnerFragmentDoc}`;
export type FieldsTabMutateUpdateRunnerMutationFn = Apollo.MutationFunction<Types.FieldsTabMutateUpdateRunnerMutation, Types.FieldsTabMutateUpdateRunnerMutationVariables>;

/**
 * __useFieldsTabMutateUpdateRunnerMutation__
 *
 * To run a mutation, you first call `useFieldsTabMutateUpdateRunnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFieldsTabMutateUpdateRunnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fieldsTabMutateUpdateRunnerMutation, { data, loading, error }] = useFieldsTabMutateUpdateRunnerMutation({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *      runnerId: // value for 'runnerId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useFieldsTabMutateUpdateRunnerMutation(baseOptions?: Apollo.MutationHookOptions<Types.FieldsTabMutateUpdateRunnerMutation, Types.FieldsTabMutateUpdateRunnerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.FieldsTabMutateUpdateRunnerMutation, Types.FieldsTabMutateUpdateRunnerMutationVariables>(FieldsTabMutateUpdateRunnerDocument, options);
      }
export type FieldsTabMutateUpdateRunnerMutationHookResult = ReturnType<typeof useFieldsTabMutateUpdateRunnerMutation>;
export type FieldsTabMutateUpdateRunnerMutationResult = Apollo.MutationResult<Types.FieldsTabMutateUpdateRunnerMutation>;
export type FieldsTabMutateUpdateRunnerMutationOptions = Apollo.BaseMutationOptions<Types.FieldsTabMutateUpdateRunnerMutation, Types.FieldsTabMutateUpdateRunnerMutationVariables>;
export const FieldsTabMutateWithdrawRunnerDocument = gql`
    mutation FieldsTabMutateWithdrawRunner($fieldId: ID!, $runnerId: ID!) {
  withdrawRunner(fieldId: $fieldId, runnerId: $runnerId) {
    fieldId
    runners {
      ...RacePageRunner
    }
  }
}
    ${RacePageRunnerFragmentDoc}`;
export type FieldsTabMutateWithdrawRunnerMutationFn = Apollo.MutationFunction<Types.FieldsTabMutateWithdrawRunnerMutation, Types.FieldsTabMutateWithdrawRunnerMutationVariables>;

/**
 * __useFieldsTabMutateWithdrawRunnerMutation__
 *
 * To run a mutation, you first call `useFieldsTabMutateWithdrawRunnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFieldsTabMutateWithdrawRunnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fieldsTabMutateWithdrawRunnerMutation, { data, loading, error }] = useFieldsTabMutateWithdrawRunnerMutation({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *      runnerId: // value for 'runnerId'
 *   },
 * });
 */
export function useFieldsTabMutateWithdrawRunnerMutation(baseOptions?: Apollo.MutationHookOptions<Types.FieldsTabMutateWithdrawRunnerMutation, Types.FieldsTabMutateWithdrawRunnerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.FieldsTabMutateWithdrawRunnerMutation, Types.FieldsTabMutateWithdrawRunnerMutationVariables>(FieldsTabMutateWithdrawRunnerDocument, options);
      }
export type FieldsTabMutateWithdrawRunnerMutationHookResult = ReturnType<typeof useFieldsTabMutateWithdrawRunnerMutation>;
export type FieldsTabMutateWithdrawRunnerMutationResult = Apollo.MutationResult<Types.FieldsTabMutateWithdrawRunnerMutation>;
export type FieldsTabMutateWithdrawRunnerMutationOptions = Apollo.BaseMutationOptions<Types.FieldsTabMutateWithdrawRunnerMutation, Types.FieldsTabMutateWithdrawRunnerMutationVariables>;
export const FieldsTabMutateReinstateRunnerDocument = gql`
    mutation FieldsTabMutateReinstateRunner($fieldId: ID!, $runnerId: ID!) {
  reinstateRunner(fieldId: $fieldId, runnerId: $runnerId) {
    fieldId
    runners {
      ...RacePageRunner
    }
  }
}
    ${RacePageRunnerFragmentDoc}`;
export type FieldsTabMutateReinstateRunnerMutationFn = Apollo.MutationFunction<Types.FieldsTabMutateReinstateRunnerMutation, Types.FieldsTabMutateReinstateRunnerMutationVariables>;

/**
 * __useFieldsTabMutateReinstateRunnerMutation__
 *
 * To run a mutation, you first call `useFieldsTabMutateReinstateRunnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFieldsTabMutateReinstateRunnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fieldsTabMutateReinstateRunnerMutation, { data, loading, error }] = useFieldsTabMutateReinstateRunnerMutation({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *      runnerId: // value for 'runnerId'
 *   },
 * });
 */
export function useFieldsTabMutateReinstateRunnerMutation(baseOptions?: Apollo.MutationHookOptions<Types.FieldsTabMutateReinstateRunnerMutation, Types.FieldsTabMutateReinstateRunnerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.FieldsTabMutateReinstateRunnerMutation, Types.FieldsTabMutateReinstateRunnerMutationVariables>(FieldsTabMutateReinstateRunnerDocument, options);
      }
export type FieldsTabMutateReinstateRunnerMutationHookResult = ReturnType<typeof useFieldsTabMutateReinstateRunnerMutation>;
export type FieldsTabMutateReinstateRunnerMutationResult = Apollo.MutationResult<Types.FieldsTabMutateReinstateRunnerMutation>;
export type FieldsTabMutateReinstateRunnerMutationOptions = Apollo.BaseMutationOptions<Types.FieldsTabMutateReinstateRunnerMutation, Types.FieldsTabMutateReinstateRunnerMutationVariables>;
export const RaceInfoTabMutateCreateDocument = gql`
    mutation RaceInfoTabMutateCreate($data: RaceInput!) {
  createRace(data: $data) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;
export type RaceInfoTabMutateCreateMutationFn = Apollo.MutationFunction<Types.RaceInfoTabMutateCreateMutation, Types.RaceInfoTabMutateCreateMutationVariables>;

/**
 * __useRaceInfoTabMutateCreateMutation__
 *
 * To run a mutation, you first call `useRaceInfoTabMutateCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRaceInfoTabMutateCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [raceInfoTabMutateCreateMutation, { data, loading, error }] = useRaceInfoTabMutateCreateMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRaceInfoTabMutateCreateMutation(baseOptions?: Apollo.MutationHookOptions<Types.RaceInfoTabMutateCreateMutation, Types.RaceInfoTabMutateCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RaceInfoTabMutateCreateMutation, Types.RaceInfoTabMutateCreateMutationVariables>(RaceInfoTabMutateCreateDocument, options);
      }
export type RaceInfoTabMutateCreateMutationHookResult = ReturnType<typeof useRaceInfoTabMutateCreateMutation>;
export type RaceInfoTabMutateCreateMutationResult = Apollo.MutationResult<Types.RaceInfoTabMutateCreateMutation>;
export type RaceInfoTabMutateCreateMutationOptions = Apollo.BaseMutationOptions<Types.RaceInfoTabMutateCreateMutation, Types.RaceInfoTabMutateCreateMutationVariables>;
export const RaceInfoTabMutateUpdateDocument = gql`
    mutation RaceInfoTabMutateUpdate($raceId: ID!, $data: RaceInput!) {
  updateRace(raceId: $raceId, data: $data) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;
export type RaceInfoTabMutateUpdateMutationFn = Apollo.MutationFunction<Types.RaceInfoTabMutateUpdateMutation, Types.RaceInfoTabMutateUpdateMutationVariables>;

/**
 * __useRaceInfoTabMutateUpdateMutation__
 *
 * To run a mutation, you first call `useRaceInfoTabMutateUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRaceInfoTabMutateUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [raceInfoTabMutateUpdateMutation, { data, loading, error }] = useRaceInfoTabMutateUpdateMutation({
 *   variables: {
 *      raceId: // value for 'raceId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRaceInfoTabMutateUpdateMutation(baseOptions?: Apollo.MutationHookOptions<Types.RaceInfoTabMutateUpdateMutation, Types.RaceInfoTabMutateUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RaceInfoTabMutateUpdateMutation, Types.RaceInfoTabMutateUpdateMutationVariables>(RaceInfoTabMutateUpdateDocument, options);
      }
export type RaceInfoTabMutateUpdateMutationHookResult = ReturnType<typeof useRaceInfoTabMutateUpdateMutation>;
export type RaceInfoTabMutateUpdateMutationResult = Apollo.MutationResult<Types.RaceInfoTabMutateUpdateMutation>;
export type RaceInfoTabMutateUpdateMutationOptions = Apollo.BaseMutationOptions<Types.RaceInfoTabMutateUpdateMutation, Types.RaceInfoTabMutateUpdateMutationVariables>;
export const RaceInfoTabMutateOpenDocument = gql`
    mutation RaceInfoTabMutateOpen($raceId: ID!) {
  openRace(raceId: $raceId) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;
export type RaceInfoTabMutateOpenMutationFn = Apollo.MutationFunction<Types.RaceInfoTabMutateOpenMutation, Types.RaceInfoTabMutateOpenMutationVariables>;

/**
 * __useRaceInfoTabMutateOpenMutation__
 *
 * To run a mutation, you first call `useRaceInfoTabMutateOpenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRaceInfoTabMutateOpenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [raceInfoTabMutateOpenMutation, { data, loading, error }] = useRaceInfoTabMutateOpenMutation({
 *   variables: {
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function useRaceInfoTabMutateOpenMutation(baseOptions?: Apollo.MutationHookOptions<Types.RaceInfoTabMutateOpenMutation, Types.RaceInfoTabMutateOpenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RaceInfoTabMutateOpenMutation, Types.RaceInfoTabMutateOpenMutationVariables>(RaceInfoTabMutateOpenDocument, options);
      }
export type RaceInfoTabMutateOpenMutationHookResult = ReturnType<typeof useRaceInfoTabMutateOpenMutation>;
export type RaceInfoTabMutateOpenMutationResult = Apollo.MutationResult<Types.RaceInfoTabMutateOpenMutation>;
export type RaceInfoTabMutateOpenMutationOptions = Apollo.BaseMutationOptions<Types.RaceInfoTabMutateOpenMutation, Types.RaceInfoTabMutateOpenMutationVariables>;
export const RaceInfoTabMutateLockDocument = gql`
    mutation RaceInfoTabMutateLock($raceId: ID!) {
  lockRace(raceId: $raceId) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;
export type RaceInfoTabMutateLockMutationFn = Apollo.MutationFunction<Types.RaceInfoTabMutateLockMutation, Types.RaceInfoTabMutateLockMutationVariables>;

/**
 * __useRaceInfoTabMutateLockMutation__
 *
 * To run a mutation, you first call `useRaceInfoTabMutateLockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRaceInfoTabMutateLockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [raceInfoTabMutateLockMutation, { data, loading, error }] = useRaceInfoTabMutateLockMutation({
 *   variables: {
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function useRaceInfoTabMutateLockMutation(baseOptions?: Apollo.MutationHookOptions<Types.RaceInfoTabMutateLockMutation, Types.RaceInfoTabMutateLockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RaceInfoTabMutateLockMutation, Types.RaceInfoTabMutateLockMutationVariables>(RaceInfoTabMutateLockDocument, options);
      }
export type RaceInfoTabMutateLockMutationHookResult = ReturnType<typeof useRaceInfoTabMutateLockMutation>;
export type RaceInfoTabMutateLockMutationResult = Apollo.MutationResult<Types.RaceInfoTabMutateLockMutation>;
export type RaceInfoTabMutateLockMutationOptions = Apollo.BaseMutationOptions<Types.RaceInfoTabMutateLockMutation, Types.RaceInfoTabMutateLockMutationVariables>;
export const RaceInfoTabMutateMarkScoredDocument = gql`
    mutation RaceInfoTabMutateMarkScored($raceId: ID!) {
  markRaceScored(raceId: $raceId) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;
export type RaceInfoTabMutateMarkScoredMutationFn = Apollo.MutationFunction<Types.RaceInfoTabMutateMarkScoredMutation, Types.RaceInfoTabMutateMarkScoredMutationVariables>;

/**
 * __useRaceInfoTabMutateMarkScoredMutation__
 *
 * To run a mutation, you first call `useRaceInfoTabMutateMarkScoredMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRaceInfoTabMutateMarkScoredMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [raceInfoTabMutateMarkScoredMutation, { data, loading, error }] = useRaceInfoTabMutateMarkScoredMutation({
 *   variables: {
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function useRaceInfoTabMutateMarkScoredMutation(baseOptions?: Apollo.MutationHookOptions<Types.RaceInfoTabMutateMarkScoredMutation, Types.RaceInfoTabMutateMarkScoredMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RaceInfoTabMutateMarkScoredMutation, Types.RaceInfoTabMutateMarkScoredMutationVariables>(RaceInfoTabMutateMarkScoredDocument, options);
      }
export type RaceInfoTabMutateMarkScoredMutationHookResult = ReturnType<typeof useRaceInfoTabMutateMarkScoredMutation>;
export type RaceInfoTabMutateMarkScoredMutationResult = Apollo.MutationResult<Types.RaceInfoTabMutateMarkScoredMutation>;
export type RaceInfoTabMutateMarkScoredMutationOptions = Apollo.BaseMutationOptions<Types.RaceInfoTabMutateMarkScoredMutation, Types.RaceInfoTabMutateMarkScoredMutationVariables>;
export const RaceInfoTabMutateCancelDocument = gql`
    mutation RaceInfoTabMutateCancel($raceId: ID!) {
  cancelRace(raceId: $raceId) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;
export type RaceInfoTabMutateCancelMutationFn = Apollo.MutationFunction<Types.RaceInfoTabMutateCancelMutation, Types.RaceInfoTabMutateCancelMutationVariables>;

/**
 * __useRaceInfoTabMutateCancelMutation__
 *
 * To run a mutation, you first call `useRaceInfoTabMutateCancelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRaceInfoTabMutateCancelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [raceInfoTabMutateCancelMutation, { data, loading, error }] = useRaceInfoTabMutateCancelMutation({
 *   variables: {
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function useRaceInfoTabMutateCancelMutation(baseOptions?: Apollo.MutationHookOptions<Types.RaceInfoTabMutateCancelMutation, Types.RaceInfoTabMutateCancelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RaceInfoTabMutateCancelMutation, Types.RaceInfoTabMutateCancelMutationVariables>(RaceInfoTabMutateCancelDocument, options);
      }
export type RaceInfoTabMutateCancelMutationHookResult = ReturnType<typeof useRaceInfoTabMutateCancelMutation>;
export type RaceInfoTabMutateCancelMutationResult = Apollo.MutationResult<Types.RaceInfoTabMutateCancelMutation>;
export type RaceInfoTabMutateCancelMutationOptions = Apollo.BaseMutationOptions<Types.RaceInfoTabMutateCancelMutation, Types.RaceInfoTabMutateCancelMutationVariables>;
export const RacePageDocument = gql`
    query RacePage($raceId: ID!) {
  race(raceId: $raceId) {
    ...RacePageRace
  }
}
    ${RacePageRaceFragmentDoc}`;

/**
 * __useRacePageQuery__
 *
 * To run a query within a React component, call `useRacePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useRacePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRacePageQuery({
 *   variables: {
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function useRacePageQuery(baseOptions: Apollo.QueryHookOptions<Types.RacePageQuery, Types.RacePageQueryVariables> & ({ variables: Types.RacePageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.RacePageQuery, Types.RacePageQueryVariables>(RacePageDocument, options);
      }
export function useRacePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.RacePageQuery, Types.RacePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.RacePageQuery, Types.RacePageQueryVariables>(RacePageDocument, options);
        }
export function useRacePageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.RacePageQuery, Types.RacePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.RacePageQuery, Types.RacePageQueryVariables>(RacePageDocument, options);
        }
export type RacePageQueryHookResult = ReturnType<typeof useRacePageQuery>;
export type RacePageLazyQueryHookResult = ReturnType<typeof useRacePageLazyQuery>;
export type RacePageSuspenseQueryHookResult = ReturnType<typeof useRacePageSuspenseQuery>;
export type RacePageQueryResult = Apollo.QueryResult<Types.RacePageQuery, Types.RacePageQueryVariables>;
export const RacesPageDocument = gql`
    query RacesPage {
  adminRaces {
    id
    name
    location
    distanceInKm
    status
    timezone
    fields {
      id
      gender
      startAt
      startList {
        fieldId
        runners {
          id
          isWithdrawn
        }
      }
    }
  }
}
    `;

/**
 * __useRacesPageQuery__
 *
 * To run a query within a React component, call `useRacesPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useRacesPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRacesPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useRacesPageQuery(baseOptions?: Apollo.QueryHookOptions<Types.RacesPageQuery, Types.RacesPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.RacesPageQuery, Types.RacesPageQueryVariables>(RacesPageDocument, options);
      }
export function useRacesPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.RacesPageQuery, Types.RacesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.RacesPageQuery, Types.RacesPageQueryVariables>(RacesPageDocument, options);
        }
export function useRacesPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.RacesPageQuery, Types.RacesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.RacesPageQuery, Types.RacesPageQueryVariables>(RacesPageDocument, options);
        }
export type RacesPageQueryHookResult = ReturnType<typeof useRacesPageQuery>;
export type RacesPageLazyQueryHookResult = ReturnType<typeof useRacesPageLazyQuery>;
export type RacesPageSuspenseQueryHookResult = ReturnType<typeof useRacesPageSuspenseQuery>;
export type RacesPageQueryResult = Apollo.QueryResult<Types.RacesPageQuery, Types.RacesPageQueryVariables>;
export const ResultsTabMutatePublishDocument = gql`
    mutation ResultsTabMutatePublish($fieldId: ID!, $rankingList: [ID!]!, $winnerTimeInSeconds: Int!) {
  publishFieldResult(
    fieldId: $fieldId
    rankingList: $rankingList
    winnerTimeInSeconds: $winnerTimeInSeconds
  ) {
    fieldId
    version
    rankingList
    winnerTimeInSeconds
    publishedAt
  }
}
    `;
export type ResultsTabMutatePublishMutationFn = Apollo.MutationFunction<Types.ResultsTabMutatePublishMutation, Types.ResultsTabMutatePublishMutationVariables>;

/**
 * __useResultsTabMutatePublishMutation__
 *
 * To run a mutation, you first call `useResultsTabMutatePublishMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResultsTabMutatePublishMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resultsTabMutatePublishMutation, { data, loading, error }] = useResultsTabMutatePublishMutation({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *      rankingList: // value for 'rankingList'
 *      winnerTimeInSeconds: // value for 'winnerTimeInSeconds'
 *   },
 * });
 */
export function useResultsTabMutatePublishMutation(baseOptions?: Apollo.MutationHookOptions<Types.ResultsTabMutatePublishMutation, Types.ResultsTabMutatePublishMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.ResultsTabMutatePublishMutation, Types.ResultsTabMutatePublishMutationVariables>(ResultsTabMutatePublishDocument, options);
      }
export type ResultsTabMutatePublishMutationHookResult = ReturnType<typeof useResultsTabMutatePublishMutation>;
export type ResultsTabMutatePublishMutationResult = Apollo.MutationResult<Types.ResultsTabMutatePublishMutation>;
export type ResultsTabMutatePublishMutationOptions = Apollo.BaseMutationOptions<Types.ResultsTabMutatePublishMutation, Types.ResultsTabMutatePublishMutationVariables>;