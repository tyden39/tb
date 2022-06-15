import { FBAudio } from 'components/atoms/fillintheblankAudio'
import { FBParagraph } from 'components/atoms/fillintheblankParagraph'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateFB3 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  console.log('go here', data?.question_text)
  return (
    <div className={`m-unittest-fb3 ${className}`} style={style}>
      <div className="m-unittest-fb3__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>

      <div className="m-unittest-fb3__listquestion">
        <div className="m-unittest-fb3__left">
          <FBAudio
            data={
              data?.audio.startsWith('blob')
                ? data.audio
                : `/upload/${data?.audio || ''}`
            }
          />
        </div>
        <div className="m-unittest-fb3__right">
          <FBParagraph
            answer={data?.correct_answers || ''}
            data={data?.question_text || ''}
          />
        </div>
      </div>
    </div>
  )
}
