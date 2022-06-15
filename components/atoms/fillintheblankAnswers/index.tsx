import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: string
}

export const FBAnwers = ({ className = '', style, data }: PropsType) => {
  return (
    <div className={`a-fb-answers ${className}`} style={style}>
      <ul className="a-fb-answers__answer">
        <li>
          <span className="answers">{data}</span>
        </li>
      </ul>
    </div>
  )
}
