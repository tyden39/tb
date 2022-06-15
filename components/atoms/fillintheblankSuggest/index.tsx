import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  answer?: string
  hint?: string
}

export const FBSuggest = ({
  className = '',
  answer,
  hint,
  style,
}: PropsType) => {
  return (
    <div className={`a-fb-suggest ${className}`} style={style}>
      <div className="a-fb-suggest__title">
        <span>Gợi ý: {hint}</span>
        <div className="a-fb-suggest__correct-answer">
          Đáp án đúng: {answer}
        </div>
      </div>
    </div>
  )
}
