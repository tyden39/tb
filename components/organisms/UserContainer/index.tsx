import { CSSProperties, useState, useRef } from 'react'

import { useRouter } from 'next/dist/client/router'
import { Button } from 'rsuite'

import { Card } from 'components/atoms/card'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { MultiSelectPicker } from 'components/atoms/selectPicker/multiSelectPicker'
import { UserTable } from 'components/molecules/userTable'
import { useRoles } from 'lib/swr-hook'
import { Collapse } from 'react-collapse'

type PropsType = {
  className?: string
  style?: CSSProperties
}

export const UserContainer = ({ className = '', style }: PropsType) => {
  const router = useRouter()
  const { roles } = useRoles()

  const [triggerReset, setTriggerReset] = useState(false)
  const [textSearch, setTextSearch] = useState('')

  const [dataFilter, setDataFilter] = useState({
    name: '',
    role: '',
    status: '',
  });

  const [isOpenFilterCollapse, setIsOpenFilterCollapse] = useState(false)
  const [filterBagde, setFilterBagde] = useState(0)
  const filterDataRef = useRef<any>({})

  const fullRole: any = [
    { display: 'Admin', code: '0'}
  ]

  const setFilter = (type: string, value: any) => {
    filterDataRef.current[type] = value
    setFilterBagde(
      Object.keys(filterDataRef.current).filter(
        (m) => filterDataRef.current[m].length > 0,
      ).length,
    )

    const newData: any = { ...dataFilter }
    newData[type] = value
    setDataFilter(newData)
  }

  const handleFilterSubmit = async (isReset: boolean) => {
    if (isReset) {
      setDataFilter({
        name: '',
        role: '',
        status: '',
      })
      setFilterBagde(0);
      Object.keys(filterDataRef.current).filter(
        (m) => filterDataRef.current[m] = ''
      )
      return;
    }
    // setStartSearch(!startSearch)
    const newData: any = { ...dataFilter }
    newData.name = textSearch;
    setDataFilter(newData)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    handleFilterSubmit(false);
  }

  const getFullRole = () => {
    roles.map((m) => {
      fullRole.push({ display: m.name, code: m.id.toString() })
    })
    return fullRole;
  }

  return (
    <div className={`m-user__content${className}`} style={style}>
      <form
        autoComplete="new-password"
        onSubmit={onSubmit}
      >
      <div className="content__sup">
        <div className="__input-group">
          <InputWithLabel
            className="__search-box"
            label="Tên người dùng/email"
            placeholder="Tìm kiếm tên người dùng/email"
            triggerReset={triggerReset}
            type="text"
            onChange={(val) => setTextSearch(val)}
            icon={<img src="/images/icons/ic-search-dark.png" alt="search" />}
          />
          <Button
            className="__sub-btn"
            data-active={isOpenFilterCollapse}
            style={{ marginLeft: '0.8rem' }}
            onClick={() => setIsOpenFilterCollapse(!isOpenFilterCollapse)}
          >
            <div
              className="__badge"
              data-value={filterBagde}
              data-hidden={filterBagde <= 0}
            >
              <img src="/images/icons/ic-filter-dark.png" alt="filter" />
            </div>
            <span>Lọc</span>
          </Button>
          <Button
            className="__sub-btn"
            onClick={() => {
              setTriggerReset(!triggerReset)
              handleFilterSubmit(true)
            }}
          >
            <img src="/images/icons/ic-reset-darker.png" alt="reset" />
            <span>Reset</span>
          </Button>
          <Button
            className="__main-btn"
            onClick={() => {
              handleFilterSubmit(false)
            }}
          >
            <img src="/images/icons/ic-search-dark.png" alt="find" />
            <span>Tìm kiếm</span>
          </Button>
        </div>
        <div className="__action-group">
          <Button
            className="__action-btn"
            onClick={() => {
              router.push('/users/[userSlug]', `/users/${-1}`)
            }}
          >
            <img src="/images/icons/ic-plus-white.png" alt="create" />
            <span>Tạo mới</span>
          </Button>
        </div>
      </div>
      <Collapse isOpened={isOpenFilterCollapse}>
        <div className="content__sub">
          {roles && (
            <MultiSelectPicker
              className="__filter-box"
              label="Vai trò"
              triggerReset={triggerReset}
              data={getFullRole()}
              onChange={(val) => setFilter('role', val)}
            />
          )}
          <MultiSelectPicker
            className="__filter-box"
            data={[
              { code: 'AC', display: 'Hoạt động' },
              { code: 'DI', display: 'Không hoạt động' },
            ]}
            label="Trạng thái"
            triggerReset={triggerReset}
            onChange={(val) => setFilter('status', val)}
          />
        </div>
      </Collapse>
      </form>
      <Card
        className={`m-user-table-data ${className}`}
        title={''}
        style={style}
      >
        <UserTable dataFilter={dataFilter} />
      </Card>
    </div>
  )
}
