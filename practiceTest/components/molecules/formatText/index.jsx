import { SPECIAL_SCRIPT } from '../../../interfaces/constants'

export const FormatText = ({ tag = 'p', className, style, children }) => {
  const Tag = tag

  // break line
  let replaceScript = `${children}`
  replaceScript = replaceScript.replace(/\r\n/g, '<br />')
  replaceScript = replaceScript.replace(/\\n/g, '<br />')
  replaceScript = replaceScript.replace(/\n/g, '<br />')
  // generate tag style
  SPECIAL_SCRIPT.forEach((character) => {
    const splitArr = replaceScript.split(character)
    const scriptTag = character.replace(/%/g, '')
    let newStr = ''
    splitArr.forEach(
      (item, j) =>
        (newStr += j % 2 === 1 ? `<${scriptTag}>${item}</${scriptTag}>` : item),
    )
    replaceScript = newStr
  })
  // return html
  const scriptHtml = replaceScript

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: scriptHtml }}
      style={style}
    />
  )
}
