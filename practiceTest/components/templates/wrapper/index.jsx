import { useEffect, useState } from 'react'

import Aos from 'aos'
import Cookies from 'js-cookie'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Container, Content, DOMHelper, Loader } from 'rsuite'

import {
  EDU_MODE,
  PREFIX_APP_EDU_COOKIE,
  PREFIX_APP_UUID,
} from '../../../interfaces/constants'
import { WRAPPER_TYPE } from '../../../interfaces/types'
import { logInfoApp } from '../../../utils/log'
import { CustomHeader } from '../../organisms/header'
import { Spinner } from '../../organisms/spinner'
import { AuthWrapper } from '../authWrapper'

export const Wrapper = ({
  isHavingHeader = true,
  isLoading = true,
  page,
  children,
}) => {
  const router = useRouter()

  const [isReady, setIsReady] = useState(true)

  const { addClass, removeClass } = DOMHelper

  const handleRouteStart = () => {
    setIsReady(false)
    const body = document.querySelector('body')
    if (body) addClass(body, '--hidden-overflow')
  }
  const handleRouteComplete = () => {
    setIsReady(true)
    const body = document.querySelector('body')
    if (body) removeClass(body, '--hidden-overflow')
  }

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteStart)
    return () => router.events.off('routeChangeStart', handleRouteStart)
  }, [])

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteComplete)
    return () => router.events.off('routeChangeComplete', handleRouteComplete)
  }, [])

  useEffect(() => {
    document.querySelector('body').setAttribute('id', 'practice-test')

    Aos.init({
      duration: 500,
      easing: 'ease-in',
      offset: 0,
      once: true,
    })
    const cookies = Cookies.get()
    let cookieNames = []
    for (const [key, value] of Object.entries(cookies)) {
      if (key.startsWith(PREFIX_APP_UUID) || key.startsWith('pt_frt'))
        cookieNames.push(key)
    }
    window.addEventListener('unload', () =>
      cookieNames.forEach((item) => Cookies.remove(item)),
    )
  }, [])

  if (isLoading)
    return (
      <Loader
        backdrop={true}
        content="Loading"
        size="lg"
        speed="slow"
        vertical={true}
      />
    )

  return (
    <>
      {/* <AuthWrapper> */}
      <Container
        id={page?.id || ''}
        className={`pt-t-wrapper ${isHavingHeader ? '' : '--no-header'}`}
      >
        {isHavingHeader && <CustomHeader page={page} />}
        <Content className="pt-t-wrapper__content">{children}</Content>
      </Container>
      {/* </AuthWrapper> */}
      {!isReady && <Spinner className="global-loader" />}
    </>
  )
}

Wrapper.propsTypes = WRAPPER_TYPE
