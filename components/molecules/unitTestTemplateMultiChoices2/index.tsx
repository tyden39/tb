import { MultiChoicesAnwers } from 'components/atoms/multichoiceAnswers'
import { MultiChoicesImage } from 'components/atoms/multichoiceImage'
import { MultiChoicesQuestion } from 'components/atoms/multichoiceQuestion'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateMultiChoices2 = ({
  className = '',
  data,
  style,
}: Props) => {
  return (
    <div className={`m-unittest-multi-choice-2 ${className}`} style={style}>
      <div className="m-unittest-multi-choice-2__tutorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <div className="m-unittest-multi-choice-2__listquestion">
        <div className="m-unittest-multi-choice-2__left">
          <div className="m-unittest-multi-choice-2__question">
            <div className="m-unittest-multi-choice-2__image">
              <MultiChoicesImage
                data={
                  data?.image.startsWith('blob')
                    ? data?.image
                    : `/upload/${data?.image || ''}`
                }
              />
            </div>
            <MultiChoicesQuestion
              className="question"
              data={data?.question_text || ''}
            />
          </div>
        </div>
        <div className="m-unittest-multi-choice-2__right">
          <div className="m-unittest-multi-choice-2__tutorial">
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
