import { CSSProperties, useState } from 'react'

import { UseFormRegisterReturn } from 'react-hook-form'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  defaultValue?: any
  label: string
  name?: string
  reverse?: boolean
  register?: UseFormRegisterReturn
  disabled?: boolean
  rows?: number
  onBlur?: () => null
  inputStyle?: CSSProperties
}

export const TextAreaField = ({
  className = '',
  defaultValue = '',
  label,
  name,
  reverse = false,
  style,
  register,
  disabled,
  onBlur,
  inputStyle,
}: PropsType) => {
  const [value, setValue] = useState(defaultValue ?? '')
  return (
    <div
      className={`a-textarea-with-label ${className}`}
      data-exist={value ? true : false}
      data-reverse={reverse}
      style={style}
    >
      <textarea
        style={inputStyle}
        value={value}
        name={name}
        disabled={disabled}
        {...register}
        onChange={(e) => {
          setValue(e.target.value)
          register?.onChange(e)
        }}
        onBlur={(e) => {
          onBlur && onBlur()
          register?.onBlur(e)
        }}
      />
      <label>
        <span>{label}</span>
      </label>
    </div>
  )
}
