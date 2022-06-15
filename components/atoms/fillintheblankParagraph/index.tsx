import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  answer?: string
  data?: string
}

export const FBParagraph = ({
  className = '',
  answer,
  data,
  style,
}: PropsType) => {
  const formatData = () => {
    const answerList = answer.split('#')
    const dataList = data.replace(/\n/g, '<br />').split('%s%')

    let returnStr = ''
    dataList.forEach((item, i) => {
      returnStr += `${item} ${
        answerList[i]
          ? `____<span class="answers">${answerList[i]}</span>____`
          : ''
      }`
    })
    return returnStr
  }

  return (
    <div className={`a-fb-paragraph ${className}`} style={style}>
      <div className="a-fb-paragraph__title">
        <p
          dangerouslySetInnerHTML={{
            __html: formatData(),
          }}
        ></p>
      </div>
    </div>
  )
}
