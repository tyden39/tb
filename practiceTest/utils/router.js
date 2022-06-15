import Hashids from 'hashids'

import { removeAccents } from './functions'

export const hashId = (id, type, isEncode = true) => {
  let formatStringId = id
  if (!isEncode) formatStringId = removeAccents(id)
  const times = {
    grade: 314,
    test: 129996,
  }
  if (!times[type]) return null
  const hashids = new Hashids()
  return isEncode
    ? hashids.encode(formatStringId * times[type])
    : hashids.decode(formatStringId)[0] / times[type]
}

export const getQueryParams = (path) => {
  const queryArr = path.split('?')
  if (!queryArr[1]) return {}
  const queryStr = queryArr[1]
  const queries = queryStr.split('&')
  const params = {}
  queries.forEach((q) => {
    const item = q.split('=')
    params[item[0]] = item[1]
  })
  return params
}
