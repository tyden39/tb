import { FBAudio } from 'components/atoms/fillintheblankAudio'
import { FBParagraph } from 'components/atoms/fillintheblankParagraph'
import { MultiChoicesImage } from 'components/atoms/multichoiceImage'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateFB4 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  console.log('go here', data)

  return (
    <div className={`m-unittest-fb4 ${className}`} style={style}>
      <div className="m-unittest-fb4__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>

      <div className="m-unittest-fb4__listquestion">
        <div className="m-unittest-fb4__left">
          <FBAudio
            data={
              data?.audio.startsWith('blob')
                ? data.audio
                : `/upload/${data?.audio || ''}`
            }
          />
        </div>
        <div className="m-unittest-fb4__right">
          <div className="m-unittest-fb4__image">
            <MultiChoicesImage
              data={
                data?.image.startsWith('blob')
                  ? data.image
                  : `/upload/${data?.image || ''}`
              }
            />
          </div>
          <div className="m-unittest-multi-choice-1__answers">
            <FBParagraph
              answer={data?.correct_answers || ''}
              data={data?.question_text || ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
