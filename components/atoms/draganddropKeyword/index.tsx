import { DefaultPropsType } from '../../../interfaces/types'
import { DDAnswers } from '../draganddropAnswers'

interface PropsType extends DefaultPropsType {
  answers: string[]
  correctAnswer: string
}

export const DDKeyword = ({
  className = '',
  answers,
  correctAnswer,
  style,
}: PropsType) => {
  return (
    <div className={`a-dd-keyword ${className}`} style={style}>
      <div className="a-dd-keyword__item">
        <span className="a-dd-keyword__title">Từ khoá:</span>
        {answers.map((item: string, i: number) => (
          <button key={i} className="a-dd-keyword__btn">
            <span className="a-dd-keyword__name">{item}</span>
          </button>
        ))}
      </div>
      <DDAnswers data={correctAnswer} />
    </div>
  )
}
