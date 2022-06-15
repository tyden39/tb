import { AiOutlinePlus } from 'react-icons/ai'
import { BsFillMicFill } from 'react-icons/bs'
import { GiArchiveResearch } from 'react-icons/gi'
import { GoTextSize } from 'react-icons/go'
import { ImHeadphones, ImSpellCheck } from 'react-icons/im'
import { MdOutlineTextSnippet } from 'react-icons/md'
import { RiBallPenFill } from 'react-icons/ri'

import { FBAudio } from 'components/atoms/fillintheblankAudio'
import { MultiChoicesAnwers } from 'components/atoms/multichoiceAnswers'
import { MultiChoicesQuestion } from 'components/atoms/multichoiceQuestion'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'
import { MultipleResponsesAnswers } from 'components/atoms/multipleresponsesAnswers'

import { DefaultPropsType } from '../../../interfaces/types'
import {
  MULTI_CHOICE_TUTORIAL,
  MULTI_RESPONSES_ANSWERS,
} from '../../../practiceTest/interfaces/constants'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateMR2 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  console.log(data)

  return (
    <div className={`m-unittest-mr-2 ${className}`} style={style}>
      <div className="m-unittest-mr-2__tutorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <div className="m-unittest-mr-2__listquestion">
        <div className="m-unittest-mr-2__left">
          <div className="m-unittest-mr-2__answers">
            <FBAudio
              data={
                data?.audio.startsWith('blob')
                  ? data.audio
                  : `/upload/${data?.audio || ''}`
              }
            />
          </div>
        </div>
        <div className="m-unittest-mr-2__right">
          <div className="m-unittest-mr-2__answers">
            <MultipleResponsesAnswers
              className="answers"
              data={data?.answers ? data.answers.split('#') : []}
              correctData={
                data?.correct_answers ? data.correct_answers.split('#') : []
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
