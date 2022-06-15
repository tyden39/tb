import { useEffect, useState } from 'react'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  AUTH_COOKIE,
  EXPIRED_AUTH_COOKIE_DAY_NUMBER,
  EXPIRED_DATE_AUTH_COOKIE,
} from '../../../interfaces/constants'
import { AUTH_WRAPPER_TYPE } from '../../../interfaces/types'
import { checkExpiredCookie, genExpiredDate } from '../../../utils/fetch'

export const AuthWrapper = ({ children }) => {
  const router = useRouter()

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // get user token
    let userToken = Cookies.get(AUTH_COOKIE)
    if (userToken) {
      // if account inactive in <EXPIRED_AUTH_COOKIE_DAY_NUMBER> days -> cookie will be deleted
      const expiredAuthCookie = Cookies.get(EXPIRED_DATE_AUTH_COOKIE)
      // => delete cookies
      if (checkExpiredCookie(expiredAuthCookie)) {
        userToken = null
        Cookies.remove(AUTH_COOKIE)
        Cookies.remove(EXPIRED_DATE_AUTH_COOKIE)
      }
      // => assign expired day into <EXPIRED_AUTH_COOKIE_DAY_NUMBER> days
      else {
        Cookies.set(AUTH_COOKIE, userToken, {
          expires: EXPIRED_AUTH_COOKIE_DAY_NUMBER,
        })
        Cookies.set(
          EXPIRED_DATE_AUTH_COOKIE,
          genExpiredDate(EXPIRED_AUTH_COOKIE_DAY_NUMBER),
          { expires: EXPIRED_AUTH_COOKIE_DAY_NUMBER },
        )
      }
      setIsReady(true)
      // ==========================================================
    } else router.push(`/login?path=${router.pathname}&as=${router.asPath}`)
  }, [])

  if (!isReady) return <></>

  return children
}

AuthWrapper.propTypes = AUTH_WRAPPER_TYPE
