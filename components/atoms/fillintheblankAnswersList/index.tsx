import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  title?: string
  data?: any
  total?: number
  pageIndex?: number
  radioName?: string
}

export const FBAnswersList = ({ className = '', style, data }: PropsType) => {
  return (
    <div className={`a-fb-answerslist ${className}`} style={style}>
      <ul className="a-fb-answerslist__answer">
        <li>
          {data.txt} ___<span className="answers">{data.answer}</span>
        </li>
      </ul>
    </div>
  )
}
