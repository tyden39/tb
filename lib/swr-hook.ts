import useSWR from 'swr'

import { paths } from 'api/paths'
import {
  QuestionDataType,
  RoleDataType,
  UnitTestDataType,
  UserDataType,
} from 'interfaces/types'

function fetcher(url: string) {
  return window.fetch(url).then((res) => res.json())
}

export function useQuestions(
  pageIndex: number,
  limit = 10,
  query: any = {},
  isMine: boolean = false,
) {
  const { data, error, mutate } = useSWR<any, any>(
    `${paths.api_questions}?page=${pageIndex}&limit=${limit}&p=${
      query?.publisher ?? ''
    }&s=${query?.series ?? ''}&g=${query?.grade ?? ''}&sk=${
      query?.skills ?? ''
    }&l=${query?.level ?? ''}&qt=${query?.question_type ?? ''}&q=${
      query?.question_text ?? ''
    }&m=${isMine ? 1 : 0}`,
    fetcher,
  )
  return {
    questions: data?.data as QuestionDataType[],
    isLoading: !error && !data,
    isError: error,
    totalRecords: data?.totalRecords,
    mutateQuestions: mutate,
  }
}

export function useQuestion(id: string) {
  const { data, error } = useSWR<QuestionDataType, any>(
    id !== '-1' ? `${paths.api_questions}/${id}` : null,
    fetcher,
  )
  return {
    question: data,
    isError: error,
  }
}

export function useUsers(pageIndex: number, limit = 10, filter: any) {
  const { data, error, mutate } = useSWR<any, any>(
    `${paths.api_users}?page=${pageIndex}&limit=${limit}&name=${filter?.name}&role=${filter?.role}&status=${filter?.status}`,
    fetcher,
  )

  return {
    users: data?.data as UserDataType[],
    isLoading: !error && !data,
    isError: error,
    totalRecords: data?.totalRecords,
    mutateUsers: mutate,
  }
}

export function useUser(id: string) {
  const { data, error } = useSWR<UserDataType, any>(
    id !== '-1' ? `${paths.api_users}/${id}` : null,
    fetcher,
  )
  return {
    user: data,
    isError: error,
  }
}

export function useRoles() {
  const { data, error } = useSWR<RoleDataType[], any>(
    paths.api_users_roles,
    fetcher,
  )

  return {
    roles: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useUnitTest(pageIndex: number, limit = 10) {
  const { data, error, mutate } = useSWR<any, any>(
    `${paths.api_unit_test}?page=${pageIndex}&limit=${limit}`,
    fetcher,
  )
  return {
    unitTests: data?.data as UnitTestDataType[],
    isLoading: !error && !data,
    isError: error,
    totalRecords: data?.totalRecords,
    mutateUnitTest: mutate,
  }
}
