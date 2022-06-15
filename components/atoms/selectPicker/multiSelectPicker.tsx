import { useEffect, useState } from 'react'

import { Dropdown } from 'rsuite'

import { DefaultPropsType, StructType } from 'interfaces/types'

import { CheckBox } from '../checkbox'

interface PropsType extends DefaultPropsType {
  checkValue?: boolean
  data: StructType[]
  defaultValue?: StructType[]
  disabled?: boolean
  displayAll?: boolean
  hiddenValue?: boolean
  isMultiChoice?: boolean
  label?: string
  menuSize?: 'md' | 'lg' | 'xl'
  name?: string
  placeholder?: string
  placement?:
    | 'bottomStart'
    | 'bottomEnd'
    | 'topStart'
    | 'topEnd'
    | 'leftStart'
    | 'leftEnd'
    | 'rightStart'
    | 'rightEnd'
  reverseData?: boolean
  triggerReset?: boolean
  onChange?: (val: any[]) => void
}

export const MultiSelectPicker = ({
  className = '',
  checkValue = true,
  data,
  defaultValue = [],
  disabled = false,
  displayAll = true,
  hiddenValue = false,
  label = '',
  menuSize = 'md',
  name = '',
  placeholder = '',
  placement = 'bottomStart',
  triggerReset = false,
  style,
  onChange = () => null,
}: PropsType) => {
  const [isFocus, setIsFocus] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const [code, setCode] = useState(
    defaultValue.map((item) => item.code) as any[],
  )
  const [display, setDisplay] = useState(
    defaultValue.map((item) => item.display) as any[],
  )

  const handleItemSelect = (
    e: MouseEvent,
    item: StructType,
    isAdd: boolean,
  ) => {
    e.stopPropagation()
    const newCode = isAdd
      ? [...code, item.code]
      : code.filter((codeItem) => codeItem !== item.code)
    const newDisplay = isAdd
      ? [...display, item.display]
      : display.filter((displayItem) => displayItem !== item.display)
    onChange([...newCode])
    setCode([...newCode])
    setDisplay([...newDisplay])
  }

  const handleAllToggle = (e: any) => {
    e.stopPropagation()
    if (code.length > 0) {
      setCode([])
      setDisplay([])
    }
    onChange([])
  }

  // use for case reset trigger
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    setCode([])
    setDisplay([])
  }, [triggerReset])

  return (
    <div
      className={`a-select-picker ${className}`}
      title={display.join(', ')}
      style={style}
    >
      <input name={name} type="hidden" value={code.join(',')} />
      <label
        className={
          isFocus || (checkValue && display.length > 0) ? '--active' : ''
        }
      >
        <span>
          {isFocus || (checkValue && display) ? label : placeholder || label}
        </span>
      </label>
      <img
        className="a-select-picker__caret"
        src="/images/icons/ic-chevron-down-dark.png"
        alt="toggle"
      />
      <Dropdown
        className={`a-select-picker__dropdown ${
          menuSize !== 'md' ? `dropdown-menu-${menuSize}` : ''
        } ${data.length > 0 ? '' : '--hidden'} ${isFocus ? '--focus' : ''}`}
        disabled={disabled}
        placement={placement}
        title={hiddenValue && display.length <= 0 ? '' : display.join(', ')}
        onClose={() => setIsFocus(false)}
        onOpen={() => setIsFocus(true)}
        onSelect={(eventKey, e: any) =>
          eventKey.code === 'all'
            ? handleAllToggle(e)
            : handleItemSelect(e, eventKey, !code.includes(eventKey.code))
        }
      >
        {displayAll && data.length > 0 && (
          <Dropdown.Item
            key="all"
            className="a-select-picker__dropdown-item"
            eventKey={{ code: 'all', display: '' }}
            style={
              code.length <= 0
                ? { background: '#fff', cursor: 'no-drop' }
                : null
            }
          >
            <CheckBox
              className="dropdown-item__checkbox"
              checked={code.length <= 0}
              disabled={code.length <= 0}
              onChange={handleAllToggle}
            />
            <span>Tất cả</span>
          </Dropdown.Item>
        )}
        {data.map((item) => (
          <Dropdown.Item
            key={item.code}
            className="a-select-picker__dropdown-item"
            eventKey={item}
          >
            <CheckBox
              className="dropdown-item__checkbox"
              checked={code.includes(item.code)}
              onChange={(e: any) =>
                handleItemSelect(e, item, !code.includes(item.code))
              }
            />
            <span>{item.display}</span>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  )
}
