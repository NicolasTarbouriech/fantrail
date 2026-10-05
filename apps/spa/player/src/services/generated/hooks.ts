import * as Types from './operations';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export const RequireAuthDocument = gql`
    query RequireAuth {
  me {
    id
    email
    pseudo
    role
  }
}
    `;

/**
 * __useRequireAuthQuery__
 *
 * To run a query within a React component, call `useRequireAuthQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequireAuthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequireAuthQuery({
 *   variables: {
 *   },
 * });
 */
export function useRequireAuthQuery(baseOptions?: Apollo.QueryHookOptions<Types.RequireAuthQuery, Types.RequireAuthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.RequireAuthQuery, Types.RequireAuthQueryVariables>(RequireAuthDocument, options);
      }
export function useRequireAuthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.RequireAuthQuery, Types.RequireAuthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.RequireAuthQuery, Types.RequireAuthQueryVariables>(RequireAuthDocument, options);
        }
export function useRequireAuthSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.RequireAuthQuery, Types.RequireAuthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.RequireAuthQuery, Types.RequireAuthQueryVariables>(RequireAuthDocument, options);
        }
export type RequireAuthQueryHookResult = ReturnType<typeof useRequireAuthQuery>;
export type RequireAuthLazyQueryHookResult = ReturnType<typeof useRequireAuthLazyQuery>;
export type RequireAuthSuspenseQueryHookResult = ReturnType<typeof useRequireAuthSuspenseQuery>;
export type RequireAuthQueryResult = Apollo.QueryResult<Types.RequireAuthQuery, Types.RequireAuthQueryVariables>;
export const UseAuthActionsMutateLoginDocument = gql`
    mutation useAuthActionsMutateLogin($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    email
    pseudo
    role
  }
}
    `;
export type UseAuthActionsMutateLoginMutationFn = Apollo.MutationFunction<Types.UseAuthActionsMutateLoginMutation, Types.UseAuthActionsMutateLoginMutationVariables>;

/**
 * __useUseAuthActionsMutateLoginMutation__
 *
 * To run a mutation, you first call `useUseAuthActionsMutateLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUseAuthActionsMutateLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [useAuthActionsMutateLoginMutation, { data, loading, error }] = useUseAuthActionsMutateLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useUseAuthActionsMutateLoginMutation(baseOptions?: Apollo.MutationHookOptions<Types.UseAuthActionsMutateLoginMutation, Types.UseAuthActionsMutateLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UseAuthActionsMutateLoginMutation, Types.UseAuthActionsMutateLoginMutationVariables>(UseAuthActionsMutateLoginDocument, options);
      }
export type UseAuthActionsMutateLoginMutationHookResult = ReturnType<typeof useUseAuthActionsMutateLoginMutation>;
export type UseAuthActionsMutateLoginMutationResult = Apollo.MutationResult<Types.UseAuthActionsMutateLoginMutation>;
export type UseAuthActionsMutateLoginMutationOptions = Apollo.BaseMutationOptions<Types.UseAuthActionsMutateLoginMutation, Types.UseAuthActionsMutateLoginMutationVariables>;
export const UseAuthActionsMutateRegisterDocument = gql`
    mutation useAuthActionsMutateRegister($data: RegisterInput!) {
  register(data: $data) {
    id
    email
    pseudo
    role
  }
}
    `;
export type UseAuthActionsMutateRegisterMutationFn = Apollo.MutationFunction<Types.UseAuthActionsMutateRegisterMutation, Types.UseAuthActionsMutateRegisterMutationVariables>;

/**
 * __useUseAuthActionsMutateRegisterMutation__
 *
 * To run a mutation, you first call `useUseAuthActionsMutateRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUseAuthActionsMutateRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [useAuthActionsMutateRegisterMutation, { data, loading, error }] = useUseAuthActionsMutateRegisterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUseAuthActionsMutateRegisterMutation(baseOptions?: Apollo.MutationHookOptions<Types.UseAuthActionsMutateRegisterMutation, Types.UseAuthActionsMutateRegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UseAuthActionsMutateRegisterMutation, Types.UseAuthActionsMutateRegisterMutationVariables>(UseAuthActionsMutateRegisterDocument, options);
      }
export type UseAuthActionsMutateRegisterMutationHookResult = ReturnType<typeof useUseAuthActionsMutateRegisterMutation>;
export type UseAuthActionsMutateRegisterMutationResult = Apollo.MutationResult<Types.UseAuthActionsMutateRegisterMutation>;
export type UseAuthActionsMutateRegisterMutationOptions = Apollo.BaseMutationOptions<Types.UseAuthActionsMutateRegisterMutation, Types.UseAuthActionsMutateRegisterMutationVariables>;
export const UseAuthActionsMutateLogoutDocument = gql`
    mutation useAuthActionsMutateLogout {
  logout
}
    `;
export type UseAuthActionsMutateLogoutMutationFn = Apollo.MutationFunction<Types.UseAuthActionsMutateLogoutMutation, Types.UseAuthActionsMutateLogoutMutationVariables>;

/**
 * __useUseAuthActionsMutateLogoutMutation__
 *
 * To run a mutation, you first call `useUseAuthActionsMutateLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUseAuthActionsMutateLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [useAuthActionsMutateLogoutMutation, { data, loading, error }] = useUseAuthActionsMutateLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useUseAuthActionsMutateLogoutMutation(baseOptions?: Apollo.MutationHookOptions<Types.UseAuthActionsMutateLogoutMutation, Types.UseAuthActionsMutateLogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UseAuthActionsMutateLogoutMutation, Types.UseAuthActionsMutateLogoutMutationVariables>(UseAuthActionsMutateLogoutDocument, options);
      }
export type UseAuthActionsMutateLogoutMutationHookResult = ReturnType<typeof useUseAuthActionsMutateLogoutMutation>;
export type UseAuthActionsMutateLogoutMutationResult = Apollo.MutationResult<Types.UseAuthActionsMutateLogoutMutation>;
export type UseAuthActionsMutateLogoutMutationOptions = Apollo.BaseMutationOptions<Types.UseAuthActionsMutateLogoutMutation, Types.UseAuthActionsMutateLogoutMutationVariables>;
export const JoinPageDocument = gql`
    query JoinPage($inviteCode: String!) {
  leagueByInviteCode(inviteCode: $inviteCode) {
    id
    name
    memberCount
    ownerId
    isMember
    members {
      id
      pseudo
    }
    races {
      id
      name
    }
  }
}
    `;

/**
 * __useJoinPageQuery__
 *
 * To run a query within a React component, call `useJoinPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useJoinPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJoinPageQuery({
 *   variables: {
 *      inviteCode: // value for 'inviteCode'
 *   },
 * });
 */
export function useJoinPageQuery(baseOptions: Apollo.QueryHookOptions<Types.JoinPageQuery, Types.JoinPageQueryVariables> & ({ variables: Types.JoinPageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.JoinPageQuery, Types.JoinPageQueryVariables>(JoinPageDocument, options);
      }
export function useJoinPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.JoinPageQuery, Types.JoinPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.JoinPageQuery, Types.JoinPageQueryVariables>(JoinPageDocument, options);
        }
export function useJoinPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.JoinPageQuery, Types.JoinPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.JoinPageQuery, Types.JoinPageQueryVariables>(JoinPageDocument, options);
        }
export type JoinPageQueryHookResult = ReturnType<typeof useJoinPageQuery>;
export type JoinPageLazyQueryHookResult = ReturnType<typeof useJoinPageLazyQuery>;
export type JoinPageSuspenseQueryHookResult = ReturnType<typeof useJoinPageSuspenseQuery>;
export type JoinPageQueryResult = Apollo.QueryResult<Types.JoinPageQuery, Types.JoinPageQueryVariables>;
export const JoinPageMutateJoinDocument = gql`
    mutation JoinPageMutateJoin($inviteCode: String!) {
  joinLeagueByInviteCode(inviteCode: $inviteCode) {
    id
  }
}
    `;
export type JoinPageMutateJoinMutationFn = Apollo.MutationFunction<Types.JoinPageMutateJoinMutation, Types.JoinPageMutateJoinMutationVariables>;

/**
 * __useJoinPageMutateJoinMutation__
 *
 * To run a mutation, you first call `useJoinPageMutateJoinMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinPageMutateJoinMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinPageMutateJoinMutation, { data, loading, error }] = useJoinPageMutateJoinMutation({
 *   variables: {
 *      inviteCode: // value for 'inviteCode'
 *   },
 * });
 */
export function useJoinPageMutateJoinMutation(baseOptions?: Apollo.MutationHookOptions<Types.JoinPageMutateJoinMutation, Types.JoinPageMutateJoinMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.JoinPageMutateJoinMutation, Types.JoinPageMutateJoinMutationVariables>(JoinPageMutateJoinDocument, options);
      }
export type JoinPageMutateJoinMutationHookResult = ReturnType<typeof useJoinPageMutateJoinMutation>;
export type JoinPageMutateJoinMutationResult = Apollo.MutationResult<Types.JoinPageMutateJoinMutation>;
export type JoinPageMutateJoinMutationOptions = Apollo.BaseMutationOptions<Types.JoinPageMutateJoinMutation, Types.JoinPageMutateJoinMutationVariables>;
export const LoginPageDocument = gql`
    query LoginPage {
  races {
    id
    name
    status
    fields {
      id
      lockAt
      isLocked
    }
  }
}
    `;

/**
 * __useLoginPageQuery__
 *
 * To run a query within a React component, call `useLoginPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoginPageQuery(baseOptions?: Apollo.QueryHookOptions<Types.LoginPageQuery, Types.LoginPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.LoginPageQuery, Types.LoginPageQueryVariables>(LoginPageDocument, options);
      }
export function useLoginPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.LoginPageQuery, Types.LoginPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.LoginPageQuery, Types.LoginPageQueryVariables>(LoginPageDocument, options);
        }
export function useLoginPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.LoginPageQuery, Types.LoginPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.LoginPageQuery, Types.LoginPageQueryVariables>(LoginPageDocument, options);
        }
export type LoginPageQueryHookResult = ReturnType<typeof useLoginPageQuery>;
export type LoginPageLazyQueryHookResult = ReturnType<typeof useLoginPageLazyQuery>;
export type LoginPageSuspenseQueryHookResult = ReturnType<typeof useLoginPageSuspenseQuery>;
export type LoginPageQueryResult = Apollo.QueryResult<Types.LoginPageQuery, Types.LoginPageQueryVariables>;
export const HomePageDocument = gql`
    query HomePage {
  races {
    id
    name
    location
    distanceInKm
    timezone
    pickCount
    status
    trailEvent {
      id
      name
      logoUrl
    }
    fields {
      id
      gender
      startAt
      lockAt
      isLocked
      startList {
        fieldId
        withdrawnRunners {
          id
          fullName
        }
      }
      result {
        fieldId
        version
      }
    }
  }
  myPredictions {
    id
    fieldId
    pickList
    winnerTimeEstimateInSeconds
    isComplete
    withdrawnRunnerIds
  }
  myLeagues {
    id
    name
    visibility
    memberCount
    leaderboard {
      rank
      userId
      total
      scoredFieldCount
    }
  }
}
    `;

/**
 * __useHomePageQuery__
 *
 * To run a query within a React component, call `useHomePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomePageQuery(baseOptions?: Apollo.QueryHookOptions<Types.HomePageQuery, Types.HomePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.HomePageQuery, Types.HomePageQueryVariables>(HomePageDocument, options);
      }
export function useHomePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.HomePageQuery, Types.HomePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.HomePageQuery, Types.HomePageQueryVariables>(HomePageDocument, options);
        }
export function useHomePageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.HomePageQuery, Types.HomePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.HomePageQuery, Types.HomePageQueryVariables>(HomePageDocument, options);
        }
export type HomePageQueryHookResult = ReturnType<typeof useHomePageQuery>;
export type HomePageLazyQueryHookResult = ReturnType<typeof useHomePageLazyQuery>;
export type HomePageSuspenseQueryHookResult = ReturnType<typeof useHomePageSuspenseQuery>;
export type HomePageQueryResult = Apollo.QueryResult<Types.HomePageQuery, Types.HomePageQueryVariables>;
export const HomePageGetRaceScoresDocument = gql`
    query HomePageGetRaceScores($raceId: ID!) {
  communityLeaderboard(raceId: $raceId) {
    rank
    userId
    total
    scoredFieldCount
  }
}
    `;

/**
 * __useHomePageGetRaceScoresQuery__
 *
 * To run a query within a React component, call `useHomePageGetRaceScoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageGetRaceScoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageGetRaceScoresQuery({
 *   variables: {
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function useHomePageGetRaceScoresQuery(baseOptions: Apollo.QueryHookOptions<Types.HomePageGetRaceScoresQuery, Types.HomePageGetRaceScoresQueryVariables> & ({ variables: Types.HomePageGetRaceScoresQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.HomePageGetRaceScoresQuery, Types.HomePageGetRaceScoresQueryVariables>(HomePageGetRaceScoresDocument, options);
      }
export function useHomePageGetRaceScoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.HomePageGetRaceScoresQuery, Types.HomePageGetRaceScoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.HomePageGetRaceScoresQuery, Types.HomePageGetRaceScoresQueryVariables>(HomePageGetRaceScoresDocument, options);
        }
export function useHomePageGetRaceScoresSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.HomePageGetRaceScoresQuery, Types.HomePageGetRaceScoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.HomePageGetRaceScoresQuery, Types.HomePageGetRaceScoresQueryVariables>(HomePageGetRaceScoresDocument, options);
        }
export type HomePageGetRaceScoresQueryHookResult = ReturnType<typeof useHomePageGetRaceScoresQuery>;
export type HomePageGetRaceScoresLazyQueryHookResult = ReturnType<typeof useHomePageGetRaceScoresLazyQuery>;
export type HomePageGetRaceScoresSuspenseQueryHookResult = ReturnType<typeof useHomePageGetRaceScoresSuspenseQuery>;
export type HomePageGetRaceScoresQueryResult = Apollo.QueryResult<Types.HomePageGetRaceScoresQuery, Types.HomePageGetRaceScoresQueryVariables>;
export const HomePageGetFieldScoreDocument = gql`
    query HomePageGetFieldScore($fieldId: ID!) {
  myScorecard(fieldId: $fieldId) {
    fieldId
    total
  }
}
    `;

/**
 * __useHomePageGetFieldScoreQuery__
 *
 * To run a query within a React component, call `useHomePageGetFieldScoreQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageGetFieldScoreQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageGetFieldScoreQuery({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *   },
 * });
 */
export function useHomePageGetFieldScoreQuery(baseOptions: Apollo.QueryHookOptions<Types.HomePageGetFieldScoreQuery, Types.HomePageGetFieldScoreQueryVariables> & ({ variables: Types.HomePageGetFieldScoreQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.HomePageGetFieldScoreQuery, Types.HomePageGetFieldScoreQueryVariables>(HomePageGetFieldScoreDocument, options);
      }
export function useHomePageGetFieldScoreLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.HomePageGetFieldScoreQuery, Types.HomePageGetFieldScoreQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.HomePageGetFieldScoreQuery, Types.HomePageGetFieldScoreQueryVariables>(HomePageGetFieldScoreDocument, options);
        }
export function useHomePageGetFieldScoreSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.HomePageGetFieldScoreQuery, Types.HomePageGetFieldScoreQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.HomePageGetFieldScoreQuery, Types.HomePageGetFieldScoreQueryVariables>(HomePageGetFieldScoreDocument, options);
        }
export type HomePageGetFieldScoreQueryHookResult = ReturnType<typeof useHomePageGetFieldScoreQuery>;
export type HomePageGetFieldScoreLazyQueryHookResult = ReturnType<typeof useHomePageGetFieldScoreLazyQuery>;
export type HomePageGetFieldScoreSuspenseQueryHookResult = ReturnType<typeof useHomePageGetFieldScoreSuspenseQuery>;
export type HomePageGetFieldScoreQueryResult = Apollo.QueryResult<Types.HomePageGetFieldScoreQuery, Types.HomePageGetFieldScoreQueryVariables>;
export const CreateLeaguePageDocument = gql`
    query CreateLeaguePage {
  races {
    id
    name
    status
    fields {
      id
      startAt
    }
  }
}
    `;

/**
 * __useCreateLeaguePageQuery__
 *
 * To run a query within a React component, call `useCreateLeaguePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateLeaguePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateLeaguePageQuery({
 *   variables: {
 *   },
 * });
 */
export function useCreateLeaguePageQuery(baseOptions?: Apollo.QueryHookOptions<Types.CreateLeaguePageQuery, Types.CreateLeaguePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.CreateLeaguePageQuery, Types.CreateLeaguePageQueryVariables>(CreateLeaguePageDocument, options);
      }
export function useCreateLeaguePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.CreateLeaguePageQuery, Types.CreateLeaguePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.CreateLeaguePageQuery, Types.CreateLeaguePageQueryVariables>(CreateLeaguePageDocument, options);
        }
export function useCreateLeaguePageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.CreateLeaguePageQuery, Types.CreateLeaguePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.CreateLeaguePageQuery, Types.CreateLeaguePageQueryVariables>(CreateLeaguePageDocument, options);
        }
export type CreateLeaguePageQueryHookResult = ReturnType<typeof useCreateLeaguePageQuery>;
export type CreateLeaguePageLazyQueryHookResult = ReturnType<typeof useCreateLeaguePageLazyQuery>;
export type CreateLeaguePageSuspenseQueryHookResult = ReturnType<typeof useCreateLeaguePageSuspenseQuery>;
export type CreateLeaguePageQueryResult = Apollo.QueryResult<Types.CreateLeaguePageQuery, Types.CreateLeaguePageQueryVariables>;
export const CreateLeaguePageMutateCreateDocument = gql`
    mutation CreateLeaguePageMutateCreate($name: String!, $visibility: LeagueVisibility!, $raceIds: [ID!]!) {
  createLeague(name: $name, visibility: $visibility, raceIds: $raceIds) {
    id
  }
}
    `;
export type CreateLeaguePageMutateCreateMutationFn = Apollo.MutationFunction<Types.CreateLeaguePageMutateCreateMutation, Types.CreateLeaguePageMutateCreateMutationVariables>;

/**
 * __useCreateLeaguePageMutateCreateMutation__
 *
 * To run a mutation, you first call `useCreateLeaguePageMutateCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLeaguePageMutateCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLeaguePageMutateCreateMutation, { data, loading, error }] = useCreateLeaguePageMutateCreateMutation({
 *   variables: {
 *      name: // value for 'name'
 *      visibility: // value for 'visibility'
 *      raceIds: // value for 'raceIds'
 *   },
 * });
 */
export function useCreateLeaguePageMutateCreateMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateLeaguePageMutateCreateMutation, Types.CreateLeaguePageMutateCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateLeaguePageMutateCreateMutation, Types.CreateLeaguePageMutateCreateMutationVariables>(CreateLeaguePageMutateCreateDocument, options);
      }
export type CreateLeaguePageMutateCreateMutationHookResult = ReturnType<typeof useCreateLeaguePageMutateCreateMutation>;
export type CreateLeaguePageMutateCreateMutationResult = Apollo.MutationResult<Types.CreateLeaguePageMutateCreateMutation>;
export type CreateLeaguePageMutateCreateMutationOptions = Apollo.BaseMutationOptions<Types.CreateLeaguePageMutateCreateMutation, Types.CreateLeaguePageMutateCreateMutationVariables>;
export const LeaguePageDocument = gql`
    query LeaguePage($leagueId: ID!, $raceId: ID) {
  league(leagueId: $leagueId) {
    id
    name
    visibility
    memberCount
    ownerId
    isOwner
    isMember
    inviteCode
    members {
      id
      pseudo
    }
    races {
      id
      name
      status
      pickCount
      fields {
        id
        gender
        isLocked
      }
    }
    leaderboard(raceId: $raceId) {
      rank
      userId
      total
      scoredFieldCount
      player {
        id
        pseudo
      }
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
 *      raceId: // value for 'raceId'
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
export const LeaguePageGetFieldPredictionsDocument = gql`
    query LeaguePageGetFieldPredictions($leagueId: ID!, $fieldId: ID!, $raceId: ID!) {
  race(raceId: $raceId) {
    id
    fields {
      id
      startList {
        fieldId
        runners {
          id
          lastName
          favoriteRank
          isWithdrawn
        }
      }
    }
  }
  league(leagueId: $leagueId) {
    id
    fieldPredictions(fieldId: $fieldId) {
      id
      fieldId
      pickList
      winnerTimeEstimateInSeconds
      player {
        id
        pseudo
      }
    }
  }
}
    `;

/**
 * __useLeaguePageGetFieldPredictionsQuery__
 *
 * To run a query within a React component, call `useLeaguePageGetFieldPredictionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLeaguePageGetFieldPredictionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLeaguePageGetFieldPredictionsQuery({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *      fieldId: // value for 'fieldId'
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function useLeaguePageGetFieldPredictionsQuery(baseOptions: Apollo.QueryHookOptions<Types.LeaguePageGetFieldPredictionsQuery, Types.LeaguePageGetFieldPredictionsQueryVariables> & ({ variables: Types.LeaguePageGetFieldPredictionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.LeaguePageGetFieldPredictionsQuery, Types.LeaguePageGetFieldPredictionsQueryVariables>(LeaguePageGetFieldPredictionsDocument, options);
      }
export function useLeaguePageGetFieldPredictionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.LeaguePageGetFieldPredictionsQuery, Types.LeaguePageGetFieldPredictionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.LeaguePageGetFieldPredictionsQuery, Types.LeaguePageGetFieldPredictionsQueryVariables>(LeaguePageGetFieldPredictionsDocument, options);
        }
export function useLeaguePageGetFieldPredictionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.LeaguePageGetFieldPredictionsQuery, Types.LeaguePageGetFieldPredictionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.LeaguePageGetFieldPredictionsQuery, Types.LeaguePageGetFieldPredictionsQueryVariables>(LeaguePageGetFieldPredictionsDocument, options);
        }
export type LeaguePageGetFieldPredictionsQueryHookResult = ReturnType<typeof useLeaguePageGetFieldPredictionsQuery>;
export type LeaguePageGetFieldPredictionsLazyQueryHookResult = ReturnType<typeof useLeaguePageGetFieldPredictionsLazyQuery>;
export type LeaguePageGetFieldPredictionsSuspenseQueryHookResult = ReturnType<typeof useLeaguePageGetFieldPredictionsSuspenseQuery>;
export type LeaguePageGetFieldPredictionsQueryResult = Apollo.QueryResult<Types.LeaguePageGetFieldPredictionsQuery, Types.LeaguePageGetFieldPredictionsQueryVariables>;
export const LeaguePageMutateJoinDocument = gql`
    mutation LeaguePageMutateJoin($leagueId: ID!) {
  joinLeague(leagueId: $leagueId) {
    id
    isMember
    memberCount
  }
}
    `;
export type LeaguePageMutateJoinMutationFn = Apollo.MutationFunction<Types.LeaguePageMutateJoinMutation, Types.LeaguePageMutateJoinMutationVariables>;

/**
 * __useLeaguePageMutateJoinMutation__
 *
 * To run a mutation, you first call `useLeaguePageMutateJoinMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaguePageMutateJoinMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaguePageMutateJoinMutation, { data, loading, error }] = useLeaguePageMutateJoinMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *   },
 * });
 */
export function useLeaguePageMutateJoinMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeaguePageMutateJoinMutation, Types.LeaguePageMutateJoinMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeaguePageMutateJoinMutation, Types.LeaguePageMutateJoinMutationVariables>(LeaguePageMutateJoinDocument, options);
      }
export type LeaguePageMutateJoinMutationHookResult = ReturnType<typeof useLeaguePageMutateJoinMutation>;
export type LeaguePageMutateJoinMutationResult = Apollo.MutationResult<Types.LeaguePageMutateJoinMutation>;
export type LeaguePageMutateJoinMutationOptions = Apollo.BaseMutationOptions<Types.LeaguePageMutateJoinMutation, Types.LeaguePageMutateJoinMutationVariables>;
export const LeaguePageMutateLeaveDocument = gql`
    mutation LeaguePageMutateLeave($leagueId: ID!) {
  leaveLeague(leagueId: $leagueId)
}
    `;
export type LeaguePageMutateLeaveMutationFn = Apollo.MutationFunction<Types.LeaguePageMutateLeaveMutation, Types.LeaguePageMutateLeaveMutationVariables>;

/**
 * __useLeaguePageMutateLeaveMutation__
 *
 * To run a mutation, you first call `useLeaguePageMutateLeaveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaguePageMutateLeaveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaguePageMutateLeaveMutation, { data, loading, error }] = useLeaguePageMutateLeaveMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *   },
 * });
 */
export function useLeaguePageMutateLeaveMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeaguePageMutateLeaveMutation, Types.LeaguePageMutateLeaveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeaguePageMutateLeaveMutation, Types.LeaguePageMutateLeaveMutationVariables>(LeaguePageMutateLeaveDocument, options);
      }
export type LeaguePageMutateLeaveMutationHookResult = ReturnType<typeof useLeaguePageMutateLeaveMutation>;
export type LeaguePageMutateLeaveMutationResult = Apollo.MutationResult<Types.LeaguePageMutateLeaveMutation>;
export type LeaguePageMutateLeaveMutationOptions = Apollo.BaseMutationOptions<Types.LeaguePageMutateLeaveMutation, Types.LeaguePageMutateLeaveMutationVariables>;
export const LeagueSettingsPageDocument = gql`
    query LeagueSettingsPage($leagueId: ID!) {
  races {
    id
    name
    status
    fields {
      id
      startAt
    }
  }
  league(leagueId: $leagueId) {
    id
    name
    visibility
    isOwner
    ownerId
    inviteCode
    raceIds
    members {
      id
      pseudo
    }
  }
}
    `;

/**
 * __useLeagueSettingsPageQuery__
 *
 * To run a query within a React component, call `useLeagueSettingsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useLeagueSettingsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLeagueSettingsPageQuery({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *   },
 * });
 */
export function useLeagueSettingsPageQuery(baseOptions: Apollo.QueryHookOptions<Types.LeagueSettingsPageQuery, Types.LeagueSettingsPageQueryVariables> & ({ variables: Types.LeagueSettingsPageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.LeagueSettingsPageQuery, Types.LeagueSettingsPageQueryVariables>(LeagueSettingsPageDocument, options);
      }
export function useLeagueSettingsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.LeagueSettingsPageQuery, Types.LeagueSettingsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.LeagueSettingsPageQuery, Types.LeagueSettingsPageQueryVariables>(LeagueSettingsPageDocument, options);
        }
export function useLeagueSettingsPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.LeagueSettingsPageQuery, Types.LeagueSettingsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.LeagueSettingsPageQuery, Types.LeagueSettingsPageQueryVariables>(LeagueSettingsPageDocument, options);
        }
export type LeagueSettingsPageQueryHookResult = ReturnType<typeof useLeagueSettingsPageQuery>;
export type LeagueSettingsPageLazyQueryHookResult = ReturnType<typeof useLeagueSettingsPageLazyQuery>;
export type LeagueSettingsPageSuspenseQueryHookResult = ReturnType<typeof useLeagueSettingsPageSuspenseQuery>;
export type LeagueSettingsPageQueryResult = Apollo.QueryResult<Types.LeagueSettingsPageQuery, Types.LeagueSettingsPageQueryVariables>;
export const LeagueSettingsPageMutateRenameDocument = gql`
    mutation LeagueSettingsPageMutateRename($leagueId: ID!, $name: String!) {
  renameLeague(leagueId: $leagueId, name: $name) {
    id
    name
  }
}
    `;
export type LeagueSettingsPageMutateRenameMutationFn = Apollo.MutationFunction<Types.LeagueSettingsPageMutateRenameMutation, Types.LeagueSettingsPageMutateRenameMutationVariables>;

/**
 * __useLeagueSettingsPageMutateRenameMutation__
 *
 * To run a mutation, you first call `useLeagueSettingsPageMutateRenameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeagueSettingsPageMutateRenameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leagueSettingsPageMutateRenameMutation, { data, loading, error }] = useLeagueSettingsPageMutateRenameMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useLeagueSettingsPageMutateRenameMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeagueSettingsPageMutateRenameMutation, Types.LeagueSettingsPageMutateRenameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeagueSettingsPageMutateRenameMutation, Types.LeagueSettingsPageMutateRenameMutationVariables>(LeagueSettingsPageMutateRenameDocument, options);
      }
export type LeagueSettingsPageMutateRenameMutationHookResult = ReturnType<typeof useLeagueSettingsPageMutateRenameMutation>;
export type LeagueSettingsPageMutateRenameMutationResult = Apollo.MutationResult<Types.LeagueSettingsPageMutateRenameMutation>;
export type LeagueSettingsPageMutateRenameMutationOptions = Apollo.BaseMutationOptions<Types.LeagueSettingsPageMutateRenameMutation, Types.LeagueSettingsPageMutateRenameMutationVariables>;
export const LeagueSettingsPageMutateVisibilityDocument = gql`
    mutation LeagueSettingsPageMutateVisibility($leagueId: ID!, $visibility: LeagueVisibility!) {
  changeLeagueVisibility(leagueId: $leagueId, visibility: $visibility) {
    id
    visibility
  }
}
    `;
export type LeagueSettingsPageMutateVisibilityMutationFn = Apollo.MutationFunction<Types.LeagueSettingsPageMutateVisibilityMutation, Types.LeagueSettingsPageMutateVisibilityMutationVariables>;

/**
 * __useLeagueSettingsPageMutateVisibilityMutation__
 *
 * To run a mutation, you first call `useLeagueSettingsPageMutateVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeagueSettingsPageMutateVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leagueSettingsPageMutateVisibilityMutation, { data, loading, error }] = useLeagueSettingsPageMutateVisibilityMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *      visibility: // value for 'visibility'
 *   },
 * });
 */
export function useLeagueSettingsPageMutateVisibilityMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeagueSettingsPageMutateVisibilityMutation, Types.LeagueSettingsPageMutateVisibilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeagueSettingsPageMutateVisibilityMutation, Types.LeagueSettingsPageMutateVisibilityMutationVariables>(LeagueSettingsPageMutateVisibilityDocument, options);
      }
export type LeagueSettingsPageMutateVisibilityMutationHookResult = ReturnType<typeof useLeagueSettingsPageMutateVisibilityMutation>;
export type LeagueSettingsPageMutateVisibilityMutationResult = Apollo.MutationResult<Types.LeagueSettingsPageMutateVisibilityMutation>;
export type LeagueSettingsPageMutateVisibilityMutationOptions = Apollo.BaseMutationOptions<Types.LeagueSettingsPageMutateVisibilityMutation, Types.LeagueSettingsPageMutateVisibilityMutationVariables>;
export const LeagueSettingsPageMutateRegenerateCodeDocument = gql`
    mutation LeagueSettingsPageMutateRegenerateCode($leagueId: ID!) {
  regenerateLeagueInviteCode(leagueId: $leagueId) {
    id
    inviteCode
  }
}
    `;
export type LeagueSettingsPageMutateRegenerateCodeMutationFn = Apollo.MutationFunction<Types.LeagueSettingsPageMutateRegenerateCodeMutation, Types.LeagueSettingsPageMutateRegenerateCodeMutationVariables>;

/**
 * __useLeagueSettingsPageMutateRegenerateCodeMutation__
 *
 * To run a mutation, you first call `useLeagueSettingsPageMutateRegenerateCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeagueSettingsPageMutateRegenerateCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leagueSettingsPageMutateRegenerateCodeMutation, { data, loading, error }] = useLeagueSettingsPageMutateRegenerateCodeMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *   },
 * });
 */
export function useLeagueSettingsPageMutateRegenerateCodeMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeagueSettingsPageMutateRegenerateCodeMutation, Types.LeagueSettingsPageMutateRegenerateCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeagueSettingsPageMutateRegenerateCodeMutation, Types.LeagueSettingsPageMutateRegenerateCodeMutationVariables>(LeagueSettingsPageMutateRegenerateCodeDocument, options);
      }
export type LeagueSettingsPageMutateRegenerateCodeMutationHookResult = ReturnType<typeof useLeagueSettingsPageMutateRegenerateCodeMutation>;
export type LeagueSettingsPageMutateRegenerateCodeMutationResult = Apollo.MutationResult<Types.LeagueSettingsPageMutateRegenerateCodeMutation>;
export type LeagueSettingsPageMutateRegenerateCodeMutationOptions = Apollo.BaseMutationOptions<Types.LeagueSettingsPageMutateRegenerateCodeMutation, Types.LeagueSettingsPageMutateRegenerateCodeMutationVariables>;
export const LeagueSettingsPageMutateRemoveMemberDocument = gql`
    mutation LeagueSettingsPageMutateRemoveMember($leagueId: ID!, $userId: ID!) {
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
export type LeagueSettingsPageMutateRemoveMemberMutationFn = Apollo.MutationFunction<Types.LeagueSettingsPageMutateRemoveMemberMutation, Types.LeagueSettingsPageMutateRemoveMemberMutationVariables>;

/**
 * __useLeagueSettingsPageMutateRemoveMemberMutation__
 *
 * To run a mutation, you first call `useLeagueSettingsPageMutateRemoveMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeagueSettingsPageMutateRemoveMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leagueSettingsPageMutateRemoveMemberMutation, { data, loading, error }] = useLeagueSettingsPageMutateRemoveMemberMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useLeagueSettingsPageMutateRemoveMemberMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeagueSettingsPageMutateRemoveMemberMutation, Types.LeagueSettingsPageMutateRemoveMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeagueSettingsPageMutateRemoveMemberMutation, Types.LeagueSettingsPageMutateRemoveMemberMutationVariables>(LeagueSettingsPageMutateRemoveMemberDocument, options);
      }
export type LeagueSettingsPageMutateRemoveMemberMutationHookResult = ReturnType<typeof useLeagueSettingsPageMutateRemoveMemberMutation>;
export type LeagueSettingsPageMutateRemoveMemberMutationResult = Apollo.MutationResult<Types.LeagueSettingsPageMutateRemoveMemberMutation>;
export type LeagueSettingsPageMutateRemoveMemberMutationOptions = Apollo.BaseMutationOptions<Types.LeagueSettingsPageMutateRemoveMemberMutation, Types.LeagueSettingsPageMutateRemoveMemberMutationVariables>;
export const LeagueSettingsPageMutateDeleteDocument = gql`
    mutation LeagueSettingsPageMutateDelete($leagueId: ID!) {
  deleteLeague(leagueId: $leagueId)
}
    `;
export type LeagueSettingsPageMutateDeleteMutationFn = Apollo.MutationFunction<Types.LeagueSettingsPageMutateDeleteMutation, Types.LeagueSettingsPageMutateDeleteMutationVariables>;

/**
 * __useLeagueSettingsPageMutateDeleteMutation__
 *
 * To run a mutation, you first call `useLeagueSettingsPageMutateDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeagueSettingsPageMutateDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leagueSettingsPageMutateDeleteMutation, { data, loading, error }] = useLeagueSettingsPageMutateDeleteMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *   },
 * });
 */
export function useLeagueSettingsPageMutateDeleteMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeagueSettingsPageMutateDeleteMutation, Types.LeagueSettingsPageMutateDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeagueSettingsPageMutateDeleteMutation, Types.LeagueSettingsPageMutateDeleteMutationVariables>(LeagueSettingsPageMutateDeleteDocument, options);
      }
export type LeagueSettingsPageMutateDeleteMutationHookResult = ReturnType<typeof useLeagueSettingsPageMutateDeleteMutation>;
export type LeagueSettingsPageMutateDeleteMutationResult = Apollo.MutationResult<Types.LeagueSettingsPageMutateDeleteMutation>;
export type LeagueSettingsPageMutateDeleteMutationOptions = Apollo.BaseMutationOptions<Types.LeagueSettingsPageMutateDeleteMutation, Types.LeagueSettingsPageMutateDeleteMutationVariables>;
export const LeagueSettingsPageMutateRacesDocument = gql`
    mutation LeagueSettingsPageMutateRaces($leagueId: ID!, $raceIds: [ID!]!) {
  changeLeagueRaces(leagueId: $leagueId, raceIds: $raceIds) {
    id
    raceIds
  }
}
    `;
export type LeagueSettingsPageMutateRacesMutationFn = Apollo.MutationFunction<Types.LeagueSettingsPageMutateRacesMutation, Types.LeagueSettingsPageMutateRacesMutationVariables>;

/**
 * __useLeagueSettingsPageMutateRacesMutation__
 *
 * To run a mutation, you first call `useLeagueSettingsPageMutateRacesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeagueSettingsPageMutateRacesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leagueSettingsPageMutateRacesMutation, { data, loading, error }] = useLeagueSettingsPageMutateRacesMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *      raceIds: // value for 'raceIds'
 *   },
 * });
 */
export function useLeagueSettingsPageMutateRacesMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeagueSettingsPageMutateRacesMutation, Types.LeagueSettingsPageMutateRacesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeagueSettingsPageMutateRacesMutation, Types.LeagueSettingsPageMutateRacesMutationVariables>(LeagueSettingsPageMutateRacesDocument, options);
      }
export type LeagueSettingsPageMutateRacesMutationHookResult = ReturnType<typeof useLeagueSettingsPageMutateRacesMutation>;
export type LeagueSettingsPageMutateRacesMutationResult = Apollo.MutationResult<Types.LeagueSettingsPageMutateRacesMutation>;
export type LeagueSettingsPageMutateRacesMutationOptions = Apollo.BaseMutationOptions<Types.LeagueSettingsPageMutateRacesMutation, Types.LeagueSettingsPageMutateRacesMutationVariables>;
export const LeaguesPageDocument = gql`
    query LeaguesPage {
  myLeagues {
    id
    name
    visibility
    memberCount
    leaderboard {
      rank
      userId
      total
      scoredFieldCount
    }
  }
  publicLeagues {
    id
    name
    memberCount
    isMember
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
export const LeaguesPageMutateJoinByCodeDocument = gql`
    mutation LeaguesPageMutateJoinByCode($inviteCode: String!) {
  joinLeagueByInviteCode(inviteCode: $inviteCode) {
    id
  }
}
    `;
export type LeaguesPageMutateJoinByCodeMutationFn = Apollo.MutationFunction<Types.LeaguesPageMutateJoinByCodeMutation, Types.LeaguesPageMutateJoinByCodeMutationVariables>;

/**
 * __useLeaguesPageMutateJoinByCodeMutation__
 *
 * To run a mutation, you first call `useLeaguesPageMutateJoinByCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaguesPageMutateJoinByCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaguesPageMutateJoinByCodeMutation, { data, loading, error }] = useLeaguesPageMutateJoinByCodeMutation({
 *   variables: {
 *      inviteCode: // value for 'inviteCode'
 *   },
 * });
 */
export function useLeaguesPageMutateJoinByCodeMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeaguesPageMutateJoinByCodeMutation, Types.LeaguesPageMutateJoinByCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeaguesPageMutateJoinByCodeMutation, Types.LeaguesPageMutateJoinByCodeMutationVariables>(LeaguesPageMutateJoinByCodeDocument, options);
      }
export type LeaguesPageMutateJoinByCodeMutationHookResult = ReturnType<typeof useLeaguesPageMutateJoinByCodeMutation>;
export type LeaguesPageMutateJoinByCodeMutationResult = Apollo.MutationResult<Types.LeaguesPageMutateJoinByCodeMutation>;
export type LeaguesPageMutateJoinByCodeMutationOptions = Apollo.BaseMutationOptions<Types.LeaguesPageMutateJoinByCodeMutation, Types.LeaguesPageMutateJoinByCodeMutationVariables>;
export const LeaguesPageMutateJoinDocument = gql`
    mutation LeaguesPageMutateJoin($leagueId: ID!) {
  joinLeague(leagueId: $leagueId) {
    id
  }
}
    `;
export type LeaguesPageMutateJoinMutationFn = Apollo.MutationFunction<Types.LeaguesPageMutateJoinMutation, Types.LeaguesPageMutateJoinMutationVariables>;

/**
 * __useLeaguesPageMutateJoinMutation__
 *
 * To run a mutation, you first call `useLeaguesPageMutateJoinMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaguesPageMutateJoinMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaguesPageMutateJoinMutation, { data, loading, error }] = useLeaguesPageMutateJoinMutation({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *   },
 * });
 */
export function useLeaguesPageMutateJoinMutation(baseOptions?: Apollo.MutationHookOptions<Types.LeaguesPageMutateJoinMutation, Types.LeaguesPageMutateJoinMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LeaguesPageMutateJoinMutation, Types.LeaguesPageMutateJoinMutationVariables>(LeaguesPageMutateJoinDocument, options);
      }
export type LeaguesPageMutateJoinMutationHookResult = ReturnType<typeof useLeaguesPageMutateJoinMutation>;
export type LeaguesPageMutateJoinMutationResult = Apollo.MutationResult<Types.LeaguesPageMutateJoinMutation>;
export type LeaguesPageMutateJoinMutationOptions = Apollo.BaseMutationOptions<Types.LeaguesPageMutateJoinMutation, Types.LeaguesPageMutateJoinMutationVariables>;
export const PredictionPageDocument = gql`
    query PredictionPage($raceId: ID!) {
  race(raceId: $raceId) {
    id
    name
    distanceInKm
    elevationGainInMeters
    timezone
    pickCount
    timeTolerancePercent
    status
    trailEvent {
      id
      name
      logoUrl
    }
    fields {
      id
      gender
      startAt
      lockAt
      isLocked
      startList {
        fieldId
        runners {
          id
          fullName
          lastName
          nationality
          index
          favoriteRank
          isWithdrawn
        }
      }
      result {
        fieldId
        version
      }
    }
  }
  myPredictions {
    id
    fieldId
    pickList
    winnerTimeEstimateInSeconds
    isComplete
    finalizedAt
    updatedAt
    withdrawnRunnerIds
  }
  myLeagues {
    id
    raceIds
  }
}
    `;

/**
 * __usePredictionPageQuery__
 *
 * To run a query within a React component, call `usePredictionPageQuery` and pass it any options that fit your needs.
 * When your component renders, `usePredictionPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePredictionPageQuery({
 *   variables: {
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function usePredictionPageQuery(baseOptions: Apollo.QueryHookOptions<Types.PredictionPageQuery, Types.PredictionPageQueryVariables> & ({ variables: Types.PredictionPageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.PredictionPageQuery, Types.PredictionPageQueryVariables>(PredictionPageDocument, options);
      }
export function usePredictionPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.PredictionPageQuery, Types.PredictionPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.PredictionPageQuery, Types.PredictionPageQueryVariables>(PredictionPageDocument, options);
        }
export function usePredictionPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.PredictionPageQuery, Types.PredictionPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.PredictionPageQuery, Types.PredictionPageQueryVariables>(PredictionPageDocument, options);
        }
export type PredictionPageQueryHookResult = ReturnType<typeof usePredictionPageQuery>;
export type PredictionPageLazyQueryHookResult = ReturnType<typeof usePredictionPageLazyQuery>;
export type PredictionPageSuspenseQueryHookResult = ReturnType<typeof usePredictionPageSuspenseQuery>;
export type PredictionPageQueryResult = Apollo.QueryResult<Types.PredictionPageQuery, Types.PredictionPageQueryVariables>;
export const PredictionPageMutateSaveDocument = gql`
    mutation PredictionPageMutateSave($fieldId: ID!, $pickList: [ID]!, $winnerTimeEstimateInSeconds: Int) {
  savePrediction(
    fieldId: $fieldId
    pickList: $pickList
    winnerTimeEstimateInSeconds: $winnerTimeEstimateInSeconds
  ) {
    id
    fieldId
    pickList
    winnerTimeEstimateInSeconds
    isComplete
    finalizedAt
    updatedAt
    withdrawnRunnerIds
  }
}
    `;
export type PredictionPageMutateSaveMutationFn = Apollo.MutationFunction<Types.PredictionPageMutateSaveMutation, Types.PredictionPageMutateSaveMutationVariables>;

/**
 * __usePredictionPageMutateSaveMutation__
 *
 * To run a mutation, you first call `usePredictionPageMutateSaveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePredictionPageMutateSaveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [predictionPageMutateSaveMutation, { data, loading, error }] = usePredictionPageMutateSaveMutation({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *      pickList: // value for 'pickList'
 *      winnerTimeEstimateInSeconds: // value for 'winnerTimeEstimateInSeconds'
 *   },
 * });
 */
export function usePredictionPageMutateSaveMutation(baseOptions?: Apollo.MutationHookOptions<Types.PredictionPageMutateSaveMutation, Types.PredictionPageMutateSaveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.PredictionPageMutateSaveMutation, Types.PredictionPageMutateSaveMutationVariables>(PredictionPageMutateSaveDocument, options);
      }
export type PredictionPageMutateSaveMutationHookResult = ReturnType<typeof usePredictionPageMutateSaveMutation>;
export type PredictionPageMutateSaveMutationResult = Apollo.MutationResult<Types.PredictionPageMutateSaveMutation>;
export type PredictionPageMutateSaveMutationOptions = Apollo.BaseMutationOptions<Types.PredictionPageMutateSaveMutation, Types.PredictionPageMutateSaveMutationVariables>;
export const RaceLeaderboardPageDocument = gql`
    query RaceLeaderboardPage($raceId: ID!) {
  race(raceId: $raceId) {
    id
    name
    fields {
      id
      result {
        fieldId
        version
      }
    }
  }
  communityLeaderboard(raceId: $raceId) {
    rank
    userId
    total
    scoredFieldCount
    player {
      id
      pseudo
    }
  }
}
    `;

/**
 * __useRaceLeaderboardPageQuery__
 *
 * To run a query within a React component, call `useRaceLeaderboardPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useRaceLeaderboardPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRaceLeaderboardPageQuery({
 *   variables: {
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function useRaceLeaderboardPageQuery(baseOptions: Apollo.QueryHookOptions<Types.RaceLeaderboardPageQuery, Types.RaceLeaderboardPageQueryVariables> & ({ variables: Types.RaceLeaderboardPageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.RaceLeaderboardPageQuery, Types.RaceLeaderboardPageQueryVariables>(RaceLeaderboardPageDocument, options);
      }
export function useRaceLeaderboardPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.RaceLeaderboardPageQuery, Types.RaceLeaderboardPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.RaceLeaderboardPageQuery, Types.RaceLeaderboardPageQueryVariables>(RaceLeaderboardPageDocument, options);
        }
export function useRaceLeaderboardPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.RaceLeaderboardPageQuery, Types.RaceLeaderboardPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.RaceLeaderboardPageQuery, Types.RaceLeaderboardPageQueryVariables>(RaceLeaderboardPageDocument, options);
        }
export type RaceLeaderboardPageQueryHookResult = ReturnType<typeof useRaceLeaderboardPageQuery>;
export type RaceLeaderboardPageLazyQueryHookResult = ReturnType<typeof useRaceLeaderboardPageLazyQuery>;
export type RaceLeaderboardPageSuspenseQueryHookResult = ReturnType<typeof useRaceLeaderboardPageSuspenseQuery>;
export type RaceLeaderboardPageQueryResult = Apollo.QueryResult<Types.RaceLeaderboardPageQuery, Types.RaceLeaderboardPageQueryVariables>;
export const ScorecardPageDocument = gql`
    query ScorecardPage($raceId: ID!) {
  race(raceId: $raceId) {
    id
    name
    timeTolerancePercent
    fields {
      id
      gender
      startList {
        fieldId
        runners {
          id
          fullName
          isWithdrawn
        }
      }
    }
  }
}
    `;

/**
 * __useScorecardPageQuery__
 *
 * To run a query within a React component, call `useScorecardPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useScorecardPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScorecardPageQuery({
 *   variables: {
 *      raceId: // value for 'raceId'
 *   },
 * });
 */
export function useScorecardPageQuery(baseOptions: Apollo.QueryHookOptions<Types.ScorecardPageQuery, Types.ScorecardPageQueryVariables> & ({ variables: Types.ScorecardPageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.ScorecardPageQuery, Types.ScorecardPageQueryVariables>(ScorecardPageDocument, options);
      }
export function useScorecardPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.ScorecardPageQuery, Types.ScorecardPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.ScorecardPageQuery, Types.ScorecardPageQueryVariables>(ScorecardPageDocument, options);
        }
export function useScorecardPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.ScorecardPageQuery, Types.ScorecardPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.ScorecardPageQuery, Types.ScorecardPageQueryVariables>(ScorecardPageDocument, options);
        }
export type ScorecardPageQueryHookResult = ReturnType<typeof useScorecardPageQuery>;
export type ScorecardPageLazyQueryHookResult = ReturnType<typeof useScorecardPageLazyQuery>;
export type ScorecardPageSuspenseQueryHookResult = ReturnType<typeof useScorecardPageSuspenseQuery>;
export type ScorecardPageQueryResult = Apollo.QueryResult<Types.ScorecardPageQuery, Types.ScorecardPageQueryVariables>;
export const ScorecardPageGetScorecardDocument = gql`
    query ScorecardPageGetScorecard($fieldId: ID!) {
  myScorecard(fieldId: $fieldId) {
    fieldId
    resultVersion
    total
    picks {
      pickPosition
      runnerId
      finishPosition
      favoriteRank
      positionPoints
      multiplier
      points
    }
    time {
      estimateInSeconds
      actualInSeconds
      gapInSeconds
      points
    }
    bonuses {
      type
      points
    }
  }
}
    `;

/**
 * __useScorecardPageGetScorecardQuery__
 *
 * To run a query within a React component, call `useScorecardPageGetScorecardQuery` and pass it any options that fit your needs.
 * When your component renders, `useScorecardPageGetScorecardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScorecardPageGetScorecardQuery({
 *   variables: {
 *      fieldId: // value for 'fieldId'
 *   },
 * });
 */
export function useScorecardPageGetScorecardQuery(baseOptions: Apollo.QueryHookOptions<Types.ScorecardPageGetScorecardQuery, Types.ScorecardPageGetScorecardQueryVariables> & ({ variables: Types.ScorecardPageGetScorecardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.ScorecardPageGetScorecardQuery, Types.ScorecardPageGetScorecardQueryVariables>(ScorecardPageGetScorecardDocument, options);
      }
export function useScorecardPageGetScorecardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.ScorecardPageGetScorecardQuery, Types.ScorecardPageGetScorecardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.ScorecardPageGetScorecardQuery, Types.ScorecardPageGetScorecardQueryVariables>(ScorecardPageGetScorecardDocument, options);
        }
export function useScorecardPageGetScorecardSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.ScorecardPageGetScorecardQuery, Types.ScorecardPageGetScorecardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.ScorecardPageGetScorecardQuery, Types.ScorecardPageGetScorecardQueryVariables>(ScorecardPageGetScorecardDocument, options);
        }
export type ScorecardPageGetScorecardQueryHookResult = ReturnType<typeof useScorecardPageGetScorecardQuery>;
export type ScorecardPageGetScorecardLazyQueryHookResult = ReturnType<typeof useScorecardPageGetScorecardLazyQuery>;
export type ScorecardPageGetScorecardSuspenseQueryHookResult = ReturnType<typeof useScorecardPageGetScorecardSuspenseQuery>;
export type ScorecardPageGetScorecardQueryResult = Apollo.QueryResult<Types.ScorecardPageGetScorecardQuery, Types.ScorecardPageGetScorecardQueryVariables>;
export const ScoresPageDocument = gql`
    query ScoresPage {
  myTotalPoints
}
    `;

/**
 * __useScoresPageQuery__
 *
 * To run a query within a React component, call `useScoresPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useScoresPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScoresPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useScoresPageQuery(baseOptions?: Apollo.QueryHookOptions<Types.ScoresPageQuery, Types.ScoresPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.ScoresPageQuery, Types.ScoresPageQueryVariables>(ScoresPageDocument, options);
      }
export function useScoresPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.ScoresPageQuery, Types.ScoresPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.ScoresPageQuery, Types.ScoresPageQueryVariables>(ScoresPageDocument, options);
        }
export function useScoresPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<Types.ScoresPageQuery, Types.ScoresPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.ScoresPageQuery, Types.ScoresPageQueryVariables>(ScoresPageDocument, options);
        }
export type ScoresPageQueryHookResult = ReturnType<typeof useScoresPageQuery>;
export type ScoresPageLazyQueryHookResult = ReturnType<typeof useScoresPageLazyQuery>;
export type ScoresPageSuspenseQueryHookResult = ReturnType<typeof useScoresPageSuspenseQuery>;
export type ScoresPageQueryResult = Apollo.QueryResult<Types.ScoresPageQuery, Types.ScoresPageQueryVariables>;