import { CSSProperties, useState } from 'react'

import { AiOutlinePlus } from 'react-icons/ai'
import { Dropdown } from 'rsuite'

import { InputField } from 'components/atoms/inputField'
import { TASK_SELECTIONS } from 'interfaces/struct'
import { TaskSelectType } from 'interfaces/types'

type PropsType = {
  className?: string
  data: string[]
  mode?: 'templateDetail' | 'createTemplate' | 'createUnitTest'
  style?: CSSProperties
}

export const TemplateParts = ({
  className = '',
  data,
  mode = 'templateDetail',
  style,
}: PropsType) => {
  const [originData, setOriginData] = useState(
    TASK_SELECTIONS.filter((item) => data.includes(item.code.toString())),
  )
  const defaultTaskSelected = TASK_SELECTIONS.filter((item) =>
    data.includes(item.code.toString()),
  )
  const [taskSelected, setTaskSelected] = useState(
    defaultTaskSelected.map((item) => item.code),
  )

  const handleTaskDeleteClick = (code: any) => {
    const newOrigin = originData.filter((item: any) => item.code !== code)
    setOriginData([...newOrigin])
    setTaskSelected(taskSelected.filter((item) => item !== code))
  }

  const handleAddTask = (code: string, display: string) => {
    const newItem = { code, display }
    const currentArr = originData
    currentArr.push(newItem)
    setOriginData([...currentArr])
    const currentFilter = taskSelected.concat([code])
    setTaskSelected([...currentFilter])
  }

  return (
    <div className={`m-template-parts ${className}`} style={style}>
      {originData.map((item: any, i: number) => (
        <div key={item.code} className="__form-group __tag --mb-16">
          <InputField
            label={i === 0 ? 'Question types' : ''}
            type="text"
            name="question-types-clone"
            defaultValue={item?.display || ''}
            //placeholder="select question types"
            disabled={true}
            // actionBtnChildren={
            //   mode !== 'createUnitTest' ? (
            //     <AiOutlinePlus
            //       style={{
            //         color: 'red',
            //         pointerEvents: 'none',
            //         transform: 'rotate(45deg)',
            //       }}
            //     />
            //   ) : (
            //     <></>
            //   )
            // }
            // onActionBtnClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            //   e.stopPropagation()
            //   if (mode !== 'createUnitTest') handleTaskDeleteClick(item.code)
            // }}
          />
        </div>
      ))}
      <input
        type="hidden"
        name="question-types"
        value={taskSelected.join(',')}
      />
      {TASK_SELECTIONS.filter((item: any) => !taskSelected.includes(item.code))
        .length > 0 && (
        <div
          className="__form-group __task-select --mb-16"
          data-label={originData.length <= 0 ? 'Question types' : ''}
        >
          {mode !== 'createUnitTest' && (
            <Dropdown
              className="__dropdown"
              title="Add new question types"
              onSelect={(eventKey, event) => {
                event.stopPropagation()
                handleAddTask(eventKey.code, eventKey.display)
              }}
            >
              {TASK_SELECTIONS.filter(
                (item: any) => !taskSelected.includes(item.code),
              ).map((item: any) => (
                <Dropdown.Item key={item.code} eventKey={item}>
                  {item.display}
                </Dropdown.Item>
              ))}
            </Dropdown>
          )}
        </div>
      )}
    </div>
  )
}
