export const checkArray = (arr: any, isCheckArrWithLength = false) => {
  if (arr && Array.isArray(arr)) {
    if (isCheckArrWithLength) return arr.length > 0 ? true : false
    return true
  }
  return false
}

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min) as number
}

export const copyText = (str: string) => {
  /* Copy the text inside the text field */
  navigator.clipboard.writeText(str)

  /* Alert the copied text */
  alert('Copied the text: ' + str)
}

export const userInRight = (access_roles: number[], session: any) => {
  return (
    !access_roles ||
    (access_roles[0] !== -1 && session?.user?.is_admin === 1) ||
    access_roles.includes(session?.user?.user_role_id)
  )
}

export const textOverflowEllipsis = (str: string, length: number) => {
  if (!str) return ''
  return str.substr(0, length) + (str.length > length ? '...' : '')
}
