import { DDAnswers } from 'components/atoms/draganddropAnswers'
import { MultiChoicesQuestion } from 'components/atoms/multichoiceQuestion'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'
import { MULTI_CHOICE_QUESTION } from '../../../practiceTest/interfaces/constants'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateSA1 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  console.log(data)

  return (
    <div className={`m-unittest-sa1 ${className}`} style={style}>
      <div className="m-unittest-sa1__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <div className="m-unittest-sa1__listquestion">
        <div className="m-unittest-sa1__left">
          <div className="m-unittest-sa1__suggest">
            <MultiChoicesQuestion
              className="question"
              data={data?.question_text || ''}
            />
          </div>
        </div>
        <div className="m-unittest-sa1__right">
          {data?.answers && `HINT: ${data.answers}`}
          <DDAnswers data={data?.correct_answers || ''} />
        </div>
      </div>
    </div>
  )
}
