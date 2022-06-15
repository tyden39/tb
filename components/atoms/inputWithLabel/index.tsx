import { ReactNode, useEffect, useRef, useState } from 'react'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  autoFocus?: boolean
  decimal?: number
  decimalType?: 'floor' | 'round' | 'ceil'
  defaultValue?: any
  disabled?: boolean
  iconPlacement?: 'start' | 'end'
  label: string
  max?: number
  min?: number
  name?: string
  placeholder?: string
  readOnly?: boolean
  reverseData?: boolean
  triggerReset?: boolean
  type: string
  onBlur?: (val: string) => void
  onClick?: () => void
  onChange?: (val: string) => void
  onKeyUp?: (e: any, val: string) => void
  icon?: ReactNode
  isError?: boolean
}

export const InputWithLabel = ({
  autoFocus = false,
  className = '',
  decimal = 0,
  decimalType = 'round',
  defaultValue = '',
  disabled = false,
  iconPlacement = 'start',
  label,
  max,
  min,
  name,
  placeholder = '',
  readOnly = false,
  reverseData,
  triggerReset = false,
  type,
  style,
  onBlur = () => null,
  onClick = () => null,
  onChange = () => null,
  onKeyUp = () => null,
  icon,
  isError,
}: PropsType) => {
  const [value, setValue] = useState(defaultValue)
  const [tmpValue, setTmpValue] = useState(defaultValue)

  const [isFirstRender, setIsFirstRender] = useState(true)
  const [isFocus, setIsFocus] = useState(false)

  const input = useRef<HTMLInputElement>(null)

  const formatValue = () => {
    if (type === 'number') {
      if (min || min === 0) {
        if (parseFloat(value) < min) {
          setValue(min)
          return min
        }
      } else if (max || max === 0) {
        if (parseFloat(value) > max) {
          setValue(max)
          return max
        }
      }
      if (!decimal && decimal !== 0) return value
      const tmpValue = Math.pow(10, decimal)
      let formatVal = 0
      switch (decimalType) {
        case 'ceil':
          formatVal = Math.ceil(parseFloat(value) * tmpValue) / tmpValue
          break
        case 'floor':
          formatVal = Math.floor(parseFloat(value) * tmpValue) / tmpValue
          break
        default:
          formatVal = Math.round(parseFloat(value) * tmpValue) / tmpValue
          break
      }
      setValue(`${formatVal || formatVal === 0 ? formatVal : ''}`)
      return formatVal
    }
    return value
  }

  const handleInputBlur = () => {
    setTmpValue(formatValue())
    if (onBlur) onBlur(formatValue())
    if (isFocus) setIsFocus(false)
  }

  // use for case reset trigger
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    setValue('')
  }, [triggerReset])

  useEffect(() => {
    if (autoFocus && input?.current) input.current.focus()
  }, [autoFocus])

  useEffect(() => {
    setValue(tmpValue)
  }, [reverseData])

  return (
    <div
      className={`a-input-with-label ${className}`}
      data-exist={value || value === 0 ? true : false}
      data-icon={icon ? true : false}
      data-icon-placement={iconPlacement}
      style={style}
      onClick={onClick}
    >
      <input
        ref={input}
        type={type}
        value={value}
        disabled={disabled}
        max={max}
        min={min}
        name={name}
        readOnly={readOnly}
        onBlur={handleInputBlur}
        onChange={(e) => {
          setValue(e.target.value)
          if (onChange) onChange(e.target.value)
        }}
        onFocus={() => !isFocus && setIsFocus(true)}
        onKeyUp={(e: any) => onKeyUp && onKeyUp(e, e.target.value)}
        className={isError ? 'input-error' : ''}
      />
      <label>
        <span>{value || isFocus ? label : placeholder || label}</span>
      </label>
      {icon && <div className="a-input-with-label__icon">{icon}</div>}
    </div>
  )
}
