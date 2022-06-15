import { useEffect, useState } from 'react'

import { Dropdown } from 'rsuite'

import { DefaultPropsType, StructType } from 'interfaces/types'

interface PropsType extends DefaultPropsType {
  checkValue?: boolean
  data: StructType[]
  disabled?: boolean
  defaultValue?: StructType
  hiddenValue?: boolean
  isMultiChoice?: boolean
  label?: string
  name?: string
  placeholder?: string
  reverseData?: boolean
  triggerReset?: boolean
  onChange?: (val: any) => void
}

export const SelectPicker = ({
  className = '',
  checkValue = true,
  data,
  disabled = false,
  defaultValue = { code: '', display: '' },
  hiddenValue = false,
  isMultiChoice = false,
  label = '',
  name = '',
  placeholder = '',
  reverseData,
  triggerReset = false,
  style,
  onChange = () => null,
}: PropsType) => {
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [isFocus, setIsFocus] = useState(false)

  const [code, setCode] = useState(defaultValue.code as string | number)
  const [display, setDisplay] = useState(defaultValue.display)
  const [tmpCode, setTmpCode] = useState(defaultValue.code as string | number)
  const [tmpDisplay, setTmpDisplay] = useState(defaultValue.display)

  const handleItemSelect = (e: MouseEvent, item: StructType) => {
    if (isMultiChoice) e.stopPropagation()
    setTmpCode(code)
    setTmpDisplay(display)
    setTimeout(() => {
      onChange(item.code)
      setCode(item.code)
      setDisplay(item.display)
    }, 0)
  }

  useEffect(() => {
    setCode(tmpCode)
    setDisplay(tmpDisplay)
  }, [reverseData])

  // use for case reset trigger
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    setCode('')
    setDisplay('')
  }, [triggerReset])

  return (
    <div
      className={`a-select-picker ${className}`}
      data-focus={isFocus}
      style={style}
    >
      <input name={name} type="hidden" value={code} />
      {label && (
        <label className={isFocus || (checkValue && display) ? '--active' : ''}>
          <span>
            {isFocus || (checkValue && display) ? label : placeholder || label}
          </span>
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
        disabled={disabled}
        title={hiddenValue ? '' : display}
        onClose={() => setIsFocus(false)}
        onOpen={() => setIsFocus(true)}
        onSelect={(eventKey, e: any) => handleItemSelect(e, eventKey)}
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
