export const formatDate = (date: string | number | Date) => {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [day, month, year].join('/')
}

export const replaceTyphoStr = (str: string, typho: string) => {
  const tag = typho.replace(/\%/g, '')
  const splitArr = str.split(typho)
  let returnStr = ''
  splitArr.forEach((item: string, i: number) => {
    returnStr += i % 2 === 0 ? item : `<${tag}>${item}</${tag}>`
  })
  return returnStr
}
