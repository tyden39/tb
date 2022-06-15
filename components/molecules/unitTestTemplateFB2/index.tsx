import { FBParagraph } from 'components/atoms/fillintheblankParagraph'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateFB2 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  return (
    <div className={`m-unittest-fb2 ${className}`} style={style}>
      <div className="m-unittest-fb2__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <FBParagraph
        answer={data?.correct_answers || ''}
        data={data?.question_text || ''}
      />
    </div>
  )
}
