import { FBSuggest } from 'components/atoms/fillintheblankSuggest'
import { MultiChoicesQuestion } from 'components/atoms/multichoiceQuestion'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateFB1 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  return (
    <div className={`m-unittest-fb1 ${className}`} style={style}>
      <div className="m-unittest-fb1__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <div className="m-unittest-fb1__listquestion">
        <div className="m-unittest-fb1__left">
          <div className="m-unittest-fb1__suggest">
            <FBSuggest
              answer={data?.correct_answers}
              hint={data?.answers || ''}
            />
          </div>
        </div>
        <div className="m-unittest-fb1__right">
          <div className="m-unittest-fb1__general-question">
            <MultiChoicesQuestion
              className="question"
              data={data?.question_text || ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
