import { MultiChoicesAnwers } from 'components/atoms/multichoiceAnswers'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateMultiChoices3 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  return (
    <div className={`m-unittest-multi-choice-3 ${className}`} style={style}>
      <div className="m-unittest-multi-choice-3__listquestion">
        <div className="m-unittest-multi-choice-3__tutorial">
          <MultiChoicesTutorial
            className="tutorial"
            data={data?.question_description || ''}
          />
        </div>
        <div className="m-unittest-multi-choice-3__answers">
          {data.answers.split('*').map((item: string, i: number) => (
            <MultiChoicesAnwers
              key={i}
              radioName={`mc1-${data.id}`}
              checked={data?.correct_answers === item}
              className="answers"
              data={item}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
