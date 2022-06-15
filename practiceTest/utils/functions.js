import Cookies from 'js-cookie'

import { POST_LOGIN } from '../api/paths'
import {
  APP_EDUHOME_URL,
  PREFIX_EDU_COOKIE,
  PREFIX_APP_EDU_COOKIE,
  PREFIX_APP_UUID,
} from '../interfaces/constants'
import { callApi, getApiPath } from './fetch'

export const formatAudioScript = (script) => {
  let replaceScript = script
    .replace(/\[r\n,\n]/g, '\n')
    .replace(/\n/g, '<div class="--break"></div>')
  const replaceArr = replaceScript.split(/%[b,i,u]/g)
  const returnArr = []
  replaceArr.forEach((item, i) => {
    let addItem = {}
    if (i % 2 === 0) addItem.type = 'normal'
    else {
      const indexOf = script.indexOf(item)
      addItem.type = script[indexOf - 1]
    }
    addItem.value = item
    returnArr.push(addItem)
  })
  return returnArr
}

export const formatDateTime = (number) => {
  const min = Math.floor(number / 60000)
  const sec = (number - min * 60000) / 1000
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
}

export const formatMinutes = (number) => {
  const min = Math.floor(number / 60000)
  const sec = (number - min * 60000) / 1000
  return `${min < 10 ? `0${min}` : min}m ${sec < 10 ? `0${sec}` : sec}s`
}

export const getEduCookie = (code) => {
  // get edu cookie
  const eduCookie = Cookies.get(PREFIX_EDU_COOKIE + code)
  let trueCookie = ''
  // if not exist edu cookie -> check exist src cookie
  if (!eduCookie || eduCookie === 'undefined') {
    const cloneCookie = Cookies.get(PREFIX_APP_EDU_COOKIE + code)
    // if not exist clone cookie -> redirect to eduhome
    if (!cloneCookie || eduCookie === 'undefined')
      window.location.href = APP_EDUHOME_URL.default
    // if exist clone cookie -> choose clone cookie
    else trueCookie = cloneCookie
  }
  // if exist edu cookie -> choose edu cookie
  else {
    Cookies.set(PREFIX_APP_EDU_COOKIE + code, eduCookie)
    trueCookie = eduCookie
  }
  return trueCookie
}

const handleAsyncLogin = async (returnId) => {
  await callApi(
    getApiPath(POST_LOGIN),
    'POST',
    process.env.NEXT_PUBLIC_PREFIX_AUTH_TOKEN + returnId,
    {
      userId: returnId,
      mode: process.env.NEXT_PUBLIC_MODE,
      platform: process.env.NEXT_PUBLIC_PLATFORM,
    },
  )
}

export const getEduUserId = (code = '', id, mode) => {
  if (!code) return
  let userId = id.trim() === '' ? 'test-' + generateUUID() : id
  let returnId = ''
  const cookieId = Cookies.get(PREFIX_APP_UUID + code)
  if (cookieId) returnId = cookieId
  else {
    if (mode === 'Trial') userId = 'test-' + generateUUID()
    returnId = userId
    handleAsyncLogin(returnId)
  }
  Cookies.set(PREFIX_APP_UUID + code, returnId)
  return userId
}

export const generateUUID = () => {
  // Public Domain/MIT
  let d = new Date().getTime() //Timestamp
  let d2 = (performance && performance.now && performance.now() * 1000) || 0 //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export const removeAccents = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  str = str.replace(/ + /g, ' ')
  str = str.trim()
  // Remove punctuations
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  )
  return str
}
