import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data: string
}

export const DDAnswers = ({ className = '', data, style }: PropsType) => {
  return (
    <div className={`a-dd-answers ${className}`} style={style}>
      <span className="a-dd-answers__text">Đáp án: {data}</span>
    </div>
  )
}
