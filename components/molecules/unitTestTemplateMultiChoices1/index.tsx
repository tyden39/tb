import { MultiChoicesAnwers } from 'components/atoms/multichoiceAnswers'
import { MultiChoicesQuestion } from 'components/atoms/multichoiceQuestion'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateMultiChoices1 = ({
  className = '',
  data,
  style,
}: Props) => {
  console.log(data)
  return (
    <div className={`m-unittest-multi-choice-1 ${className}`} style={style}>
      <div className="m-unittest-multi-choice-1__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <div className="m-unittest-multi-choice-1__listquestion">
        <div className="m-unittest-multi-choice-1__left">
          <div className="m-unittest-multi-choice-1__question">
            <MultiChoicesQuestion
              className="question"
              data={data?.question_text || ''}
            />
          </div>
        </div>
        <div className="m-unittest-multi-choice-1__right">
          <div className="m-unittest-multi-choice-1__answers">
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
    </div>
  )
}
