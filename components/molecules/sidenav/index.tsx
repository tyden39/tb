import { useContext } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { Collapse } from 'react-collapse'

import { AppContext } from 'interfaces/contexts'

import { SIDENAV_ITEMS } from '../../../interfaces/constants'
import { DefaultPropsType } from '../../../interfaces/types'
import { SidenavItem } from '../../atoms/sidenavItem'

interface Props extends DefaultPropsType {
  isExpand: boolean
}

export const Sidenav = ({ className = '', isExpand, style }: Props) => {
  const [session] = useSession()

  if (!session) return null

  const user: any = session.user

  return (
    <div
      className={`m-sidenav ${className}`}
      style={{ ...style, overflow: isExpand ? 'hidden' : 'unset' }}
    >
      {SIDENAV_ITEMS && SIDENAV_ITEMS.length > 0 && (
        <>
          <ul className="m-sidenav__list">
            {SIDENAV_ITEMS.filter(
              (item) =>
                (user.is_admin == 1 &&
                  !(item?.access_role && item.access_role.includes(-1))) ||
                !item.access_role ||
                item.access_role.includes(user.user_role_id),
            ).map((item, i) => (
              <Item key={item.id} data={item} isExpand={isExpand} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

const Item = ({ data, isExpand }: any) => {
  const router = useRouter()

  const [session] = useSession()

  if (!session) return null

  const user: any = session.user

  const { openingCollapseList }: any = useContext(AppContext)

  const checkInCludeActive = () => {
    const pathname = router.pathname
    let check = false
    if (data?.list) {
      data.list.forEach((item: any) => {
        if (pathname.startsWith(item?.url)) {
          check = true
          return
        }
      })
    }
    return check
  }

  const checkCollapseExist = () => openingCollapseList.state.includes(data.id)

  const handleToggle = () => {
    const currentCollapseList = openingCollapseList.state
    const checkExist = checkCollapseExist()
    openingCollapseList.setState(
      checkExist
        ? [...currentCollapseList.filter((item: number) => item !== data.id)]
        : [...currentCollapseList, data.id],
    )
  }

  return (
    <li className="list-item">
      <Link href={data?.url || '/'}>
        <a
          style={{
            cursor:
              data?.url === router.pathname && !data?.list
                ? 'default'
                : 'pointer',
          }}
          onClick={(e) => {
            if (data?.url === router.pathname || !data?.url) {
              e.preventDefault()
            }
          }}
        >
          <SidenavItem
            data={data}
            isActive={
              ((!checkCollapseExist() || !isExpand) && checkInCludeActive()) ||
              (data?.baseUrl && router.pathname.startsWith(data.baseUrl))
                ? true
                : data?.url === '/'
                ? data?.url === router.pathname && !data?.list
                  ? true
                  : false
                : router.pathname.startsWith(data.url)
                ? true
                : false
            }
            isExpand={isExpand}
            isOpen={isExpand && checkCollapseExist() ? true : false}
            onToggle={handleToggle}
          />
        </a>
      </Link>
      {data?.list && data.list.length > 0 && (
        <Collapse isOpened={isExpand && checkCollapseExist() ? true : false}>
          {data.list
            .filter(
              (item: any) =>
                (user.is_admin == 1 &&
                  !(item?.access_role && item.access_role.includes(-1))) ||
                !item.access_role ||
                item.access_role.includes(user.user_role_id),
            )
            .map((item: any) => {
              const queryStr = new URLSearchParams(
                router.query as any,
              ).toString()
              const fullPath = `${router.pathname}${
                queryStr !== '' ? `?${queryStr}` : ''
              }`
              return (
                <div
                  key={item.id}
                  className="a-sidenav-item__sub-item"
                  data-active={fullPath === item.url}
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(item.url)
                  }}
                >
                  {item.name}
                </div>
              )
            })}
        </Collapse>
      )}
    </li>
  )
}
