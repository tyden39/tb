import { DDKeyword } from 'components/atoms/draganddropKeyword'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateDD1 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  return (
    <div className={`m-unittest-dd1 ${className}`} style={style}>
      <div className="m-unittest-dd1__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <DDKeyword
        answers={data?.answers ? data.answers.split('*') : []}
        correctAnswer={
          data?.correct_answers
            ? data.correct_answers.replace(/\*/g, ' ').replace(/%\/%/g, ' / ')
            : ''
        }
      />
    </div>
  )
}
