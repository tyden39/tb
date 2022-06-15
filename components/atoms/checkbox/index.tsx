import { DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  checked?: boolean
  disabled?: boolean
  name?: string
  onChange?: (e: any) => void
}

export const CheckBox = ({
  className = '',
  checked = false,
  disabled = false,
  name = '',
  style,
  onChange = () => null,
}: Props) => {
  return (
    <div
      className={`a-checkbox ${className}`}
      data-checked={checked}
      data-disabled={disabled}
      style={style}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e: any) => onChange(e)}
      />
    </div>
  )
}
