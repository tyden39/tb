import { CSSProperties, useState } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'

import { SIDENAV_ITEM_ICONS } from 'interfaces/constants'

import { SidenavItemType, DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  className?: string
  data: SidenavItemType
  isActive: boolean
  isExpand: boolean
  isOpen: boolean
  style?: CSSProperties
  onToggle?: () => void
}

export const SidenavItem = ({
  className = '',
  data,
  isActive,
  isExpand,
  isOpen,
  style,
  onToggle,
}: Props) => {
  const router = useRouter()

  const [session] = useSession()

  if (!session) return null

  const user: any = session.user

  const [status, setStatus] = useState('light' as 'active' | 'light' | 'white')

  const [isShowToolTip, setIsShowToolTip] = useState(false)

  return (
    <div
      className={`a-sidenav-item ${className}`}
      data-expand={isExpand}
      data-active={isActive}
      style={style}
      onClick={() => data.list && data.list.length && onToggle()}
      onMouseEnter={() => {
        setStatus('white')
        setIsShowToolTip(true)
      }}
      onMouseLeave={() => {
        setStatus('light')
        setIsShowToolTip(false)
      }}
    >
      <div className="a-sidenav-item__icon">
        <img
          src={SIDENAV_ITEM_ICONS[data.icon][isActive ? 'active' : status]}
          alt={data.name}
        />
      </div>
      <div className="a-sidenav-item__name">
        <span>{data.name}</span>
      </div>
      {data.list && data.list.length > 0 && (
        <img
          className="a-sidenav-item__toggle"
          src="/images/icons/ic-chevron-up-light.png"
          alt="toggle"
          data-open={isOpen}
        />
      )}
      <div
        className="a-sidenav-item__popover"
        data-active={!isExpand && isShowToolTip ? true : false}
      >
        <div className="popover-container">
          <div className="popover-item">{data.name}</div>
          {data?.list &&
            data.list
              .filter(
                (item: any) =>
                  !item.access_role ||
                  item.access_role.includes(user.user_role_id),
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="popover-item"
                  onClick={() => router.push(item.url)}
                >
                  {item.name}
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
