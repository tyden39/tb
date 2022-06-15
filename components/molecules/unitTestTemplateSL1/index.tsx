import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'
import { SLParagraph } from 'components/atoms/selectfromlistParagraph'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateSL1 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  console.log(data.answers.split('#').map((item: string) => item.split('*')))

  return (
    <div className={`m-unittest-sl1 ${className}`} style={style}>
      <div className="m-unittest-sl1__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <SLParagraph
        correctOptions={
          data?.correct_answers ? data.correct_answers.split('#') : []
        }
        data={data?.question_text || ''}
        options={
          data?.answers
            ? data.answers.split('#').map((item: string) => item.split('*'))
            : []
        }
      />
    </div>
  )
}
