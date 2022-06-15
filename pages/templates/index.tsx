import { useEffect, useState } from 'react'

import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import Error from 'next/error'

import { Templates } from 'components/pages/templates'
import { USER_ROLES } from 'interfaces/constants'
import { BreadcrumbItemType } from 'interfaces/types'

import { templateListTransformData } from '../../api/dataTransform'
import { callApi } from '../../api/utils'
import { TemplateContext } from '../../interfaces/contexts'

export default function TemplatesPage() {
  const router = useRouter()

  const [session] = useSession()
  const user: any = session?.user || null

  const [errCode, setErrCode] = useState(0)

  const [templates, setTemplates] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageName, setPageName] = useState('Cấu trúc của hệ thống')

  const pageTitle = router.query.m
    ? `Cấu trúc của ${router.query.m === 'mine' ? 'tôi' : 'giáo viên'}`
    : 'Cấu trúc của hệ thống'

  const breadcrumbData: BreadcrumbItemType[] = [
    { name: 'Tổng quan', url: '/' },
    { name: pageTitle, url: null },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const scope = router.query?.m
        ? ['mine', 'teacher'].findIndex((item) => item === router.query.m)
        : null
      const response: any = await callApi(
        '/api/templates/search',
        'post',
        'Token',
        {
          page: 0,
          scope: (scope && scope !== -1) || scope === 0 ? scope + 1 : null,
        },
      )
      if (response?.templates)
        setTemplates([...response.templates.map(templateListTransformData)])
      if (response?.currentPage) setTemplates(response.currentPage + 1)
      if (response?.totalPages) setTotalPages(response.totalPages)
      if (response) {
        setErrCode(null)
        if (router.query?.m === 'mine') setPageName('Cấu trúc của tôi')
        else if (router.query?.m === 'teacher')
          setPageName('Cấu trúc của giáo viên')
      }
    }

    let err = -1
    if (user) {
      if (router.query?.m) {
        switch (router.query.m) {
          case 'mine':
            err =
              user?.is_admin === 0 && user?.user_role_id === USER_ROLES.Teacher
                ? 0
                : 403
            break
          case 'teacher':
            err = user?.is_admin === 1 ? 0 : 403
            break
          default:
            err = 404
            break
        }
      } else err = 0
    }

    switch (err) {
      case -1:
        break
      case 0:
        fetchData()
        break
      default:
        setErrCode(err)
        break
    }
  }, [user, router.asPath])

  // not ready
  // if (errCode === 0) return <></>
  // error
  if (errCode !== null && errCode !== 0) return <Error statusCode={errCode} />
  // success
  else
    return (
      <TemplateContext.Provider
        value={{
          breadcrumbData,
          templateData: {
            state: templates,
            setState: setTemplates,
          },
          totalPages: { state: totalPages, setState: setTotalPages },
          currentPage: { state: currentPage, setState: setCurrentPage },
          isLoading: errCode === 0,
        }}
      >
        <Templates />
      </TemplateContext.Provider>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} }
}
