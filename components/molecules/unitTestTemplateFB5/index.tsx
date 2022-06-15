import { FBAnwers } from 'components/atoms/fillintheblankAnswers'
import { FBAudio } from 'components/atoms/fillintheblankAudio'
import { MultiChoicesImage } from 'components/atoms/multichoiceImage'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'
import {
  MULTI_CHOICE_LIST_ANSWERS,
  MULTI_CHOICE_TUTORIAL,
} from '../../../practiceTest/interfaces/constants'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateFB5 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  console.log(data)
  return (
    <div className={`m-unittest-fb5 ${className}`} style={style}>
      <div className="m-unittest-fb5__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>

      <div className="m-unittest-fb5__listquestion">
        <div className="m-unittest-fb5__left">
          <FBAudio
            data={
              data?.audio.startsWith('blob')
                ? data.audio
                : `/upload/${data?.audio || ''}`
            }
          />
        </div>
        <div className="m-unittest-fb5__right">
          <div className="m-unittest-fb5__image">
            <MultiChoicesImage
              data={
                data?.image.startsWith('blob')
                  ? data.image
                  : `/upload/${data?.image || ''}`
              }
            />
          </div>
          <div className="m-unittest-multi-choice-1__answers">
            {data?.correct_answers &&
              data.correct_answers
                .split('#')
                .map((item: string, index: number) => (
                  <FBAnwers
                    key={index}
                    className="answers"
                    data={item.replace(/\*/g, '/')}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
