import { useContext, useEffect, useState } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'

import { ComingSoon } from 'components/organisms/comingSoon'
import { userInRight } from 'utils'

import { AppContext, WrapperContext } from '../../../interfaces/contexts'
import { DefaultPropsType, GlobalModalType } from '../../../interfaces/types'
import { Header } from '../../organisms/header'
import { Sidebar } from '../../organisms/sidebar'
import { ModalPicker } from '../modalPicker'

interface PropsType extends DefaultPropsType {
  access_role?: number[]
  isComingSoon?: boolean
  pageTitle?: string
  templateDetailOrigin?: any
}

export const Wrapper = ({
  className = '',
  access_role,
  isComingSoon = false,
  pageTitle = '',
  templateDetailOrigin = null,
  style,
  children,
}: PropsType) => {
  const router = useRouter()

  const { isExpandSidebar } = useContext(AppContext)

  const [globalModal, setGlobalModal] = useState(null as GlobalModalType | null)
  const [templateDetail, setTemplateDetail] = useState(
    templateDetailOrigin as any,
  )

  const [session] = useSession()

  useEffect(() => {
    if (session === null) {
      router.push('/login')
    } else if (session) {
      if (!userInRight(access_role, session)) {
        router.push('/error/auth')
      }
    }
  }, [session])

  if (!session || !userInRight(access_role, session)) return null

  return (
    <WrapperContext.Provider
      value={{
        pageTitle,
        globalModal: { state: globalModal, setState: setGlobalModal },
        templateDetail: { state: templateDetail, setState: setTemplateDetail },
      }}
    >
      <div
        className={`t-wrapper ${className}`}
        data-expand={isExpandSidebar.state}
        style={style}
      >
        <div className="t-wrapper__sidebar">
          <Sidebar
            isExpand={isExpandSidebar.state}
            onToggle={() => isExpandSidebar.setState(!isExpandSidebar.state)}
          />
        </div>
        <div className="t-wrapper__header">
          <Header />
        </div>
        <main className="t-wrapper__main">
          <div className="main-content">
            {isComingSoon ? (
              <ComingSoon style={{ minHeight: 'calc(100vh - 7.2rem)' }} />
            ) : (
              children
            )}
          </div>
        </main>
      </div>
      <ModalPicker />
    </WrapperContext.Provider>
  )
}
