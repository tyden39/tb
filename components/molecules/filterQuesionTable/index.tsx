import { CSSProperties, useContext, useRef, useState } from 'react'

import { UnitTestContext } from 'interfaces/contexts'
import { TASK_SELECTIONS } from 'interfaces/struct'

type Propstype = {
  className?: string
  max: number
  data: any[]
  style?: CSSProperties
}

type ItemPropType = {
  index: number
  isFull: boolean
  data: any
  onChange: () => void
}

export const FilterQuestionTable = ({
  className = '',
  max,
  data,
  style,
}: Propstype) => {
  const [isFull, setIsFull] = useState(false)

  const table = useRef<HTMLDivElement>(null)

  const handleCheckFull = () => {
    if (table?.current) {
      const checkedCheckbox = table.current.querySelectorAll(
        'input[name="question-id"]:checked',
      )
      if (checkedCheckbox.length >= max) {
        if (!isFull) setIsFull(true)
      } else {
        if (isFull) setIsFull(false)
      }
    }
  }

  return (
    <div className={`m-filter-question-table ${className}`} style={style}>
      <div ref={table} className="__table">
        <div className="__thead">
          <div className="__tr">
            <div className="__th" style={{ flex: 1 }}></div>
            <div className="__th" style={{ flex: 1 }}>
              #
            </div>
            <div className="__th" style={{ flex: 14 }}>
              QUESTION
            </div>
            <div className="__th" style={{ flex: 8 }}>
              QUESTION TYPE
            </div>
          </div>
        </div>
        <div className="__tbody">
          {data.length > 0 ? (
            data.map((item, i) => (
              <Item
                key={item.id}
                index={i}
                data={item}
                isFull={isFull}
                onChange={() => handleCheckFull()}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', marginTop: 50 }}>No data</div>
          )}
        </div>
      </div>
    </div>
  )
}

const Item = ({ index, data, isFull, onChange }: ItemPropType) => {
  const { templateDetailData } = useContext(UnitTestContext)

  let defaultCheck = false
  const position = templateDetailData.state.questionPosition.split(',')
  const findingSection = templateDetailData.state.sections.filter(
    (item: any) => item.sectionId === position[0],
  )
  if (findingSection.length > 0) {
    const findingPart = findingSection[0].parts.filter(
      (item: any) => `${item.id}` === position[1],
    )
    if (findingPart.length > 0) {
      if (
        findingPart[0]?.questions &&
        findingPart[0].questions.filter((item: any) => item.id === data.id)
          .length > 0
      )
        defaultCheck = true
    }
  }

  const [isChecked, setIsChecked] = useState(defaultCheck)

  const radio = useRef<HTMLInputElement>(null)

  const handleChange = () => {
    const sampleData = templateDetailData.state
    sampleData.questionPosition.split(',')
    sampleData.sections.forEach((section: any) => {
      if (section.sectionId === position[0]) {
        section.parts.forEach((part: any) => {
          if (`${part.id}` === position[1]) {
            if (!part?.questions) part.questions = []
            if (isChecked)
              part.questions = part.questions.filter(
                (item: any) => item.id !== data.id,
              )
            else part.questions.push(data)
          }
        })
      }
    })
    templateDetailData.setState({ ...sampleData })
  }

  return (
    <div
      className="__tr"
      style={{ cursor: !isChecked && isFull ? 'no-drop' : 'default' }}
      onClick={() => !(!isChecked && isFull) && radio.current.click()}
    >
      <div className="__td" style={{ flex: 1 }}>
        <input
          ref={radio}
          type="checkbox"
          name="question-id"
          value={data.id}
          checked={isChecked}
          disabled={!isChecked && isFull ? true : false}
          onChange={() => {
            onChange()
            setIsChecked(!isChecked)
            handleChange()
          }}
        />
      </div>
      <div className="__td" style={{ flex: 1 }}>
        {index + 1}
      </div>
      <div className="__td" style={{ flex: 14 }}>
        {data?.question_text || ''}
      </div>
      <div className="__td" style={{ flex: 8 }}>
        {
          TASK_SELECTIONS.filter((item) => item.code === data?.question_type)[0]
            .display
        }
      </div>
    </div>
  )
}
