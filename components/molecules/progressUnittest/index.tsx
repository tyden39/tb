import { CSSProperties, useContext } from 'react'

import { SingleTemplateContext, WrapperContext } from 'interfaces/contexts'

import { DefaultPropsType } from '../../../interfaces/types'

const steps = [
  { id: 1, value: 0, name: 'Chọn cấu trúc' },
  { id: 2, value: 1, name: 'Tạo đề thi' },
  { id: 3, value: 2, name: 'Hoàn tất' },
]

interface PropsType extends DefaultPropsType {
  max: number
  value: number
  setValue: (val: number) => void
  setMax: (val: number) => void
}

export const ProgressUnittest = ({
  className = '',
  max,
  setMax,
  value,
  setValue,
}: PropsType) => {
  const { globalModal }: any = useContext(WrapperContext)
  const { chosenTemplate }: any = useContext(SingleTemplateContext)

  const handleFirstStepClick = () => {
    globalModal.setState({
      id: 'confirm-modal',
      type: 'move-to-first-step',
      content: {
        closeText: 'Giữ lại đề thi',
        submitText: 'Chọn cấu trúc mới',
        onSubmit: () => {
          chosenTemplate.setState(null)
          setMax(0)
          setValue(0)
        },
      },
    })
  }

  return (
    <div
      className={`m-progress-unittest ${className}`}
      data-value={(50 * 100) / steps.length}
      style={
        { '--value': `${(max * 100) / (steps.length - 1)}%` } as CSSProperties
      }
    >
      {steps.map((item) => (
        <div
          key={item.id}
          className="m-progress-unittest__item"
          data-active={item.value === value}
          data-disabled={item.value > max}
          onClick={() =>
            item.value === 0
              ? handleFirstStepClick()
              : item.value !== value &&
                item.value <= max &&
                setValue(item.value)
          }
        >
          <div className="badge">{item.value + 1}</div>
          <span className="title">{item.name}</span>
        </div>
      ))}
    </div>
  )
}
