import { useEffect, useState } from 'react'

import { DatePicker } from 'rsuite'

import { formatDate } from 'utils/string'

import { DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  defaultValue?: string | Date | null
  disabled?: boolean
  label: string
  name?: string
  triggerReset?: boolean
  onChange?: (val: number) => void
}

export const DateInput = ({
  className = '',
  defaultValue = '',
  disabled = false,
  label,
  name = '',
  triggerReset,
  style,
  onChange,
}: Props) => {
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [isFocus, setIsFocus] = useState(false)
  const [value, setValue] = useState(
    defaultValue ? formatDate(defaultValue) : '',
  )

  const HandleChange = (date: Date) => {
    const d = new Date(date)
    const timestamp = d.getTime()
    setValue(formatDate(date))
    if (onChange) onChange(timestamp)
  }

  // use for case reset trigger
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    onChange(null)
    setValue('')
  }, [triggerReset])

  return (
    <div className={`a-date-input ${className}`} style={style}>
      <div
        className="a-date-input__cover"
        data-focus={isFocus}
        data-active={value ? true : false}
      >
        <label>
          <span>{label}</span>
        </label>
        {value && (
          <div className="__value" data-disabled={disabled}>
            {value}
          </div>
        )}
        <img
          className="__toggle"
          src="/images/icons/ic-calendar-dark.png"
          alt="calendar"
        />
      </div>
      <DatePicker
        className="a-date-input__picker"
        disabled={disabled}
        name={name}
        placement="bottomEnd"
        cleanable={false}
        oneTap
        onEnter={() => setIsFocus(true)}
        onExit={() => setIsFocus(false)}
        onSelect={(date: Date) => HandleChange(date)}
      />
    </div>
  )
}
