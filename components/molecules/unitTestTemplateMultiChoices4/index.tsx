import { MultiChoicesAnwers } from 'components/atoms/multichoiceAnswers'
import { MultiChoicesTutorial } from 'components/atoms/multichoiceTutorial'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
}

export const UnitTestTemplateMultiChoices4 = ({
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

  return (
    <div className={`m-unittest-multi-choice-4 ${className}`} style={style}>
      <div className="m-unittest-multi-choice-4__listquestion">
        <div className="m-unittest-multi-choice-4__tutorial">
          <MultiChoicesTutorial
            className="tutorial"
            data={data?.question_description || ''}
          />
        </div>
        <div className="m-unittest-multi-choice-4__answers">
          {data.answers.split('*').map((item: string, i: number) => (
            <MultiChoicesAnwers
              key={i}
              radioName={`mc1-${data.id}`}
              checked={data?.correct_answers === item.replace(/%/g, '')}
              className="answers"
              data={
                <span
                  dangerouslySetInnerHTML={{
                    __html: formatData(item),
                  }}
                ></span>
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
