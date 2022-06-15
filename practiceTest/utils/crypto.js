import TripleDES from 'crypto-js/tripledes' // always import this first
import Utf8 from 'crypto-js/enc-utf8'
import MD5 from 'crypto-js/md5'
import ECB from 'crypto-js/mode-ecb'
import Pkcs7 from 'crypto-js/pad-pkcs7'

import { APP_KEY } from '../interfaces/constants'

export const cryptoDecrypt = (message, appKey) => {
  let base64 = Utf8.parse(APP_KEY[appKey])
  let decrypt = TripleDES.decrypt(message, MD5(base64), {
    mode: ECB,
    padding: Pkcs7
  })
  return JSON.parse(decrypt.toString(Utf8))
}