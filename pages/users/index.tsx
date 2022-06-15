import { BreadCrumbNav } from 'components/molecules/breadCrumbNav'
import { UserContainer } from 'components/organisms/UserContainer'
import { BreadcrumbItemType } from 'interfaces/types'

import { Wrapper } from '../../components/templates/wrapper'

const breadcrumbData: BreadcrumbItemType[] = [
  { name: 'Tổng quan', url: '/' },
  { name: 'Quản lý người dùng', url: null },
]

export default function UsersPage() {
  return (
    <Wrapper
      className="p-users"
      pageTitle="Danh sách người dùng"
      access_role={[]}
    >
      <div className="p-users__container" style={{ marginBottom: '2rem' }}>
        <div className="p-detail-format__breadcrumb">
          <BreadCrumbNav data={breadcrumbData} />
        </div>
        <UserContainer />
      </div>
    </Wrapper>
  )
}
