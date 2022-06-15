import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const MultiChoicesGeneralQuestion = ({
  className = '',
  data,
  style,
}: PropsType) => {
  return (
    <div
      className={`a-multichoice-general-question ${className}`}
      style={style}
    >
      <div className="a-multichoice-general-question__bg">
        <span className="a-multichoice-general-question__paragraph">
          {data}
        </span>
      </div>
    </div>
  )
}
