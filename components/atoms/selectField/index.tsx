import { UseFormRegisterReturn } from 'react-hook-form'

import { useEffect, useState } from 'react'

import CloseIcon from '@rsuite/icons/Close'
import { Dropdown } from 'rsuite'

import { DefaultPropsType, StructType } from 'interfaces/types'

interface PropsType extends DefaultPropsType {
  checkValue?: boolean
  data: StructType[]
  defaultValue?: string
  hiddenValue?: boolean
  isMultiChoice?: boolean
  label?: string
  name?: string
  register?: UseFormRegisterReturn
  disabled?: boolean
  triggerReset?: boolean
  onChange?: (str: string | number | null) => void
}

export const SelectField = ({
  checkValue = true,
  className = '',
  data,
  defaultValue = '',
  hiddenValue = false,
  isMultiChoice = false,
  label = '',
  name,
  style,
  register,
  disabled = false,
  triggerReset = false,
  onChange = () => null,
}: PropsType) => {
  const [isFocus, setIsFocus] = useState(false)

  const [code, setCode] = useState(defaultValue ?? '')
  const [display, setDisplay] = useState(
    data?.find((m) => m.code.toString() === defaultValue)?.display,
  )

  useEffect(() => {
    if (defaultValue !== code) {
      onChange('')
      setCode('')
      setDisplay('')
    }
  }, [triggerReset])

  const handleItemSelect = (e: MouseEvent, item: StructType) => {
    if (isMultiChoice) e.stopPropagation()
    onChange(item.code)
    setCode(item.code?.toString())
    setDisplay(item.display)
  }

  return (
    <div
      className={`a-select-picker ${className}`}
      data-focus={isFocus}
      style={style}
    >
      <input name={name} type="hidden" value={code} {...register} />
      {label && (
        <label className={isFocus || (checkValue && display) ? '--active' : ''}>
          <span>{label}</span>
        </label>
      )}

      <img
        className="a-select-picker__caret"
        src="/images/icons/ic-chevron-down-dark.png"
        alt="toggle"
      />
      <Dropdown
        className={`a-select-picker__dropdown ${
          data.length > 0 ? '' : '--hidden'
        }`}
        title={hiddenValue ? '' : display}
        onClose={() => setIsFocus(false)}
        onOpen={() => setIsFocus(true)}
        onSelect={(eventKey, e: any) => handleItemSelect(e, eventKey)}
        disabled={disabled}
      >
        {data.map((item) => (
          <Dropdown.Item key={item.code} eventKey={item}>
            {item.display}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  )
}
