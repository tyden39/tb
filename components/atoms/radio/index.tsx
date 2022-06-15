import { DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  checked?: boolean
  disabled?: boolean
  name?: string
  onChange?: (e: any) => void
}

export const Radio = ({
  className = '',
  checked = false,
  disabled = false,
  name = '',
  style,
  onChange = () => null,
}: Props) => {
  return (
    <div
      className={`a-radio ${className}`}
      data-checked={checked}
      data-disabled={disabled}
      style={style}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e: any) => onChange(e)}
      />
    </div>
  )
}
