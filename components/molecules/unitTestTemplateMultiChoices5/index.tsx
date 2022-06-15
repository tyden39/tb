import { Fragment } from 'react'

import { MultiChoicesAnwers } from 'components/atoms/multichoiceAnswers'
import { MultiChoicesGeneralQuestion } from 'components/atoms/multichoiceGeneralQuestion'
import { MultiChoicesQuestion } from 'components/atoms/multichoiceQuestion'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateMultiChoices5 = ({
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
    <div className={`m-unittest-multi-choice-5 ${className}`} style={style}>
      <div className="m-unittest-multi-choice-5__turorial">
        <MultiChoicesTutorial
          className="tutorial"
          data={data?.question_description || ''}
        />
      </div>
      <div className="m-unittest-multi-choice-5__listquestion">
        <div className="m-unittest-multi-choice-5__left">
          <div className="m-unittest-multi-choice-5__general-question">
            <MultiChoicesGeneralQuestion
              className="question"
              data={data?.parent_question_text || ''}
            />
          </div>
        </div>
        <div className="m-unittest-multi-choice-5__right">
          {questionList.map((item: string, i: number) => (
            <Fragment key={i}>
              {i !== 0 && <hr />}
              <div className="m-unittest-multi-choice-5__question">
                <MultiChoicesQuestion
                  className="question"
                  data={item ? `${i + 1}. ${item}` : ''}
                />
              </div>
              <div className="m-unittest-multi-choice-5__answers">
                {answerList[i] &&
                  answerList[i].map((answer: any) => (
                    <MultiChoicesAnwers
                      key={i}
                      radioName={`mc1-${data.id}`}
                      checked={
                        correctAnswerList[i].trim() ===
                        answer.trim().replace(/%/g, '')
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
