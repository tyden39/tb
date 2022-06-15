import { UseFormRegisterReturn } from 'react-hook-form'

import { useEffect, useRef, useState } from 'react'

import CloseIcon from '@rsuite/icons/Close'
import { Dropdown, Popover, Whisper } from 'rsuite'

import { DefaultPropsType, StructType } from 'interfaces/types'
import { TASK_DESCRIPTION } from 'interfaces/struct'

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

export const SelectField2 = ({
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
  const divRef = useRef<HTMLDivElement>(null)

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

    divRef.current.classList.remove('rs-dropdown-open')
    divRef.current.querySelector('ul').setAttribute('hidden', 'true')
  }

  return (
    <div
      ref={divRef}
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
          <Whisper
            key={item.code}
            trigger="hover"
            enterable
            speaker={
              <Popover>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '64.5rem',
                  }}
                  onFocus={(e) => e.preventDefault()}
                >
                  <img
                    src={`/images/game-types/${(
                      item.code as string
                    ).toLowerCase()}.png`}
                    style={{
                      objectFit: 'contain',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: '#526375',
                      marginTop: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.display.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: '1.4rem',
                      color: '#526375',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {TASK_DESCRIPTION[item.code]}
                  </span>
                </div>
              </Popover>
            }
          >
            <Dropdown.Item eventKey={item}>
              <span>{item.display}</span>
            </Dropdown.Item>
          </Whisper>
        ))}
      </Dropdown>
    </div>
  )
}
