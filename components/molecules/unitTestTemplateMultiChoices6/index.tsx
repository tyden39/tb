import { Fragment } from 'react'

import { AiOutlinePlus } from 'react-icons/ai'
import { BsFillMicFill } from 'react-icons/bs'
import { GiArchiveResearch } from 'react-icons/gi'
import { GoTextSize } from 'react-icons/go'
import { ImHeadphones, ImSpellCheck } from 'react-icons/im'
import { MdOutlineTextSnippet } from 'react-icons/md'
import { RiBallPenFill } from 'react-icons/ri'

import { FBAudio } from 'components/atoms/fillintheblankAudio'
import { MultiChoicesAnwers } from 'components/atoms/multichoiceAnswers'
import { MultiChoicesGeneralQuestion } from 'components/atoms/multichoiceGeneralQuestion'
import { MultiChoicesQuestion } from 'components/atoms/multichoiceQuestion'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'
import {
  MULTI_CHOICE_ANSWERS,
  MULTI_CHOICE_GENERAL_QUESTION,
  MULTI_CHOICE_QUESTION,
  MULTI_CHOICE_TUTORIAL,
} from '../../../practiceTest/interfaces/constants'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateMultiChoices6 = ({
  className = '',
  data,
  style,
}: PropsType) => {
  const formatData = (str: string) => {
    const splitArr = str.split('%')
    let returnStr = ''
    splitArr.forEach((item: string, i: number) => {
      returnStr += i % 2 === 0 ? item : `<u>${item}</u>`
    })
    return returnStr
  }

  const questionList = data?.question_text
    ? data.question_text
        .split('#')
        .map((item: string) => item.replace(/%s%/g, '__________'))
    : []

  const answerList = data?.answers
    ? data.answers.split('#').map((item: string) => item.split('*'))
    : []

  const correctAnswerList = data?.correct_answers
    ? data.correct_answers.split('#')
    : []

  return (
    <div className={`m-unittest-multi-choice-6 ${className}`} style={style}>
      <div className="m-unittest-multi-choice-6__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <div className="m-unittest-multi-choice-6__listquestion">
        <div className="m-unittest-multi-choice-6__left">
          <FBAudio
            data={
              data?.audio.startsWith('blob')
                ? data.audio
                : `/upload/${data?.audio || ''}`
            }
          />
        </div>
        <div className="m-unittest-multi-choice-6__right">
          {questionList.map((item: string, i: number) => (
            <Fragment key={i}>
              {i !== 0 && <hr />}
              <div className="m-unittest-multi-choice-6__question">
                <MultiChoicesQuestion
                  className="question"
                  data={item ? `${i + 1}. ${item}` : ''}
                />
              </div>
              <div className="m-unittest-multi-choice-6__answers">
                {answerList[i] &&
                  answerList[i].map((answer: any, aIndex: number) => (
                    <MultiChoicesAnwers
                      key={`${i}_${aIndex}`}
                      radioName={`mc1-${data.id}`}
                      checked={
                        correctAnswerList[i] === answer.replace(/%/g, '')
                      }
                      className="answers"
                      data={
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formatData(answer),
                          }}
                        ></span>
                      }
                    />
                  ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
