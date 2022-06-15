import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/client'
import Error from 'next/error'
import { useRouter } from 'next/router'

import { BreadCrumbNav } from 'components/molecules/breadCrumbNav'
import { UnitTestContainer } from 'components/organisms/unitTestContainer'
import { USER_ROLES } from 'interfaces/constants'
import { BreadcrumbItemType } from 'interfaces/types'

import { Wrapper } from '../../components/templates/wrapper'

export default function UnitTestListPage() {
  const router = useRouter()

  const [session] = useSession()
  const user: any = session?.user || null

  const [errCode, setErrCode] = useState(null)

  const pageTitle = router.query.m
    ? `Đề thi của ${router.query.m === 'mine' ? 'tôi' : 'giáo viên'}`
    : 'Đề thi mẫu'

  const breadcrumbData: BreadcrumbItemType[] = [
    { name: 'Tổng quan', url: '/' },
    { name: pageTitle, url: null },
  ]

  useEffect(() => {
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
        setErrCode(null)
        break
      default:
        setErrCode(err)
        break
    }
  }, [user, router.asPath])

  console.log(errCode)

  // error
  if ([404, 403].includes(errCode)) return <Error statusCode={errCode} />
  // success
  else
    return (
      <Wrapper
        className="p-create-new-template p-detail-format"
        pageTitle={
          router.query?.m
            ? router.query.m === 'mine'
              ? 'Đề thi của tôi'
              : 'Đề thi của giáo viên'
            : 'Đề thi mẫu'
        }
      >
        <div className="p-detail-format__breadcrumb">
          <BreadCrumbNav data={breadcrumbData} />
        </div>
        <UnitTestContainer />
      </Wrapper>
    )
}
