import { ChangeEvent, CSSProperties, ReactNode, useState } from 'react'

import { UseFormRegisterReturn } from 'react-hook-form'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  inputStyle?: CSSProperties
  defaultValue?: any
  label: string
  name?: string
  reverse?: boolean
  type: string
  register?: UseFormRegisterReturn
  disabled?: boolean
  autoFocus?: boolean
  icon?: ReactNode
  onBlur?: () => null
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const InputField = ({
  className = '',
  inputStyle,
  defaultValue = '',
  label,
  name,
  type,
  style,
  register,
  disabled,
  autoFocus = false,
  icon,
  onBlur,
  onChange,
}: PropsType) => {
  const [value, setValue] = useState(defaultValue ?? '')
  return (
    <div
      className={`a-input-with-label ${className}`}
      data-exist={value ? true : false}
      data-icon={icon ? true : false}
      style={style}
    >
      <input
        style={inputStyle}
        type={type}
        value={value}
        name={name}
        disabled={disabled}
        {...register}
        onChange={(e) => {
          setValue(e.target.value)
          register?.onChange(e)
          onChange && onChange(e)
        }}
        onBlur={(e) => {
          onBlur && onBlur()
          register?.onBlur(e)
        }}
        autoFocus={autoFocus}
        autoComplete="off"
      />
      <label>
        <span>{label}</span>
      </label>
      {icon && <div className="a-input-with-label__icon">{icon}</div>}
    </div>
  )
}
