import { toaster } from 'rsuite'

import { AlertNoti } from '../components/atoms/alertNoti/index'

const useNoti = () => {
  const getNoti = (
    type: 'success' | 'warning' | 'error' | 'info',
    placement:
      | 'topCenter'
      | 'bottomCenter'
      | 'topStart'
      | 'topEnd'
      | 'bottomStart'
      | 'bottomEnd',
    message: any,
  ) => {
    const key = toaster.push(<AlertNoti type={type} message={message} />, {
      placement,
    })
    setTimeout(() => toaster.remove(key), 2000)
  }

  return { getNoti }
}

export default useNoti
