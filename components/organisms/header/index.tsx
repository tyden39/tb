import { useContext } from 'react'

import { signOut, useSession } from 'next-auth/client'
import { Dropdown } from 'rsuite'

import { WrapperContext } from 'interfaces/contexts'

import { DefaultPropsType } from '../../../interfaces/types'
import { HeaderAction } from '../../atoms/headerAction'

export const Header = ({ className = '', style }: DefaultPropsType) => {
  const { pageTitle } = useContext(WrapperContext)

  const [session] = useSession()

  if (!session) return <></>

  const user: any = session.user

  const onLogOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <header className={`o-header ${className}`} style={style}>
      <div className="o-header__title">
        <h1>{pageTitle}</h1>
      </div>
      <div className="o-header__action">
        {/* <div className="action-btn">
          <HeaderAction>
            <img src="/images/icons/ic-setting-dark.png" alt="notification" />
          </HeaderAction>
        </div>
        <div className="action-btn">
          <HeaderAction badge={{ content: '9+' }}>
            <img
              src="/images/icons/ic-notification-dark.png"
              alt="notification"
            />
          </HeaderAction>
        </div> */}
        <div
          className="action-account"
          data-size={user.user_name.length > 10 ? 'lg' : 'md'}
        >
          <div className="action-account-cover">
            <img
              className="avatar"
              src="/images/collections/clt-sample-avatar.png"
              alt="avatar"
            />
            <div className="info">
              <div className="upper">
                <span>{user.user_name}</span>
                <img
                  className="upper-toggle"
                  src="/images/icons/ic-chevron-down-dark.png"
                  alt="toggle"
                />
              </div>
              <div className="below">
                <span>
                  {user.is_admin === 1 ? 'Admin' : user.user_role_name}
                </span>
              </div>
            </div>
          </div>
          <Dropdown className="action-account-dropdown" title="default">
            <Dropdown.Item onSelect={onLogOut}>Đăng xuất</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}
