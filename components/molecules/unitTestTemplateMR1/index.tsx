import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'
import { MultipleResponsesAnswers } from 'components/atoms/multipleresponsesAnswers'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateMR1 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  return (
    <div className={`m-unittest-mr-1 ${className}`} style={style}>
      <div className="m-unittest-mr-1__listquestion">
        <div className="m-unittest-mr-1__tutorial">
          <MultiChoicesTutorial
            className="tutorial"
            data={data?.question_description || ''}
          />
        </div>
        <div className="m-unittest-mr-1__answers">
          <MultipleResponsesAnswers
            className="answers"
            data={data?.answers ? data.answers.split('#') : []}
            correctData={
              data?.correct_answers ? data.correct_answers.split('#') : []
            }
          />
        </div>
      </div>
    </div>
  )
}
