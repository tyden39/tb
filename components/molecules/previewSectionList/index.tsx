import { useContext } from 'react'

import { Card } from 'components/atoms/card'
import { SingleTemplateContext } from 'interfaces/contexts'
import { SKILLS_SELECTIONS } from 'interfaces/struct'

import { DefaultPropsType } from '../../../interfaces/types'

export const PreviewSectionList = ({
  className = '',
  style,
}: DefaultPropsType) => {
  const { chosenTemplate } = useContext(SingleTemplateContext)

  return (
    <div className={`m-preview-section-list ${className}`} style={style}>
      {chosenTemplate.state?.sections &&
        chosenTemplate.state.sections.map((item: any) => (
          <Card
            className="m-preview-section-list__card"
            key={item.id}
            title={
              SKILLS_SELECTIONS.find((find) => find.code === item?.sectionId)
                ?.display || 'Section'
            }
          >
            {item?.parts &&
              item.parts[0]?.questions &&
              item.parts[0].questions.map((ques: any, i: number) => (
                <Question key={ques.id} data={ques} index={i + 1} />
              ))}
          </Card>
        ))}
    </div>
  )
}

const Question = ({ data, index }: any) => {
  return (
    <div className="m-preview-section-list__question">
      <span>
        Question {index}: <b> {data?.question_text || ''}</b>
      </span>
      <p>Answer: {data?.answers}</p>
    </div>
  )
}
