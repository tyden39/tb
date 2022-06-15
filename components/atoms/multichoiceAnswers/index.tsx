import { ReactNode } from 'react'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  checked?: boolean
  data?: ReactNode
  radioName?: string
}

export const MultiChoicesAnwers = ({
  className = '',
  checked,
  data,
  radioName,
  style,
}: PropsType) => {
  return (
    <div className={`a-multichoiceanswers ${className}`} style={style}>
      <div className="a-multichoiceanswers__answer">
        <ul className="a-multichoiceanswers__input ">
          <li>
            <input
              type="checkbox"
              name={radioName}
              className="option-input checkbox"
              defaultChecked={checked}
              style={{ pointerEvents: 'none' }}
            />
            <label>{data}</label>
          </li>
        </ul>
      </div>
    </div>
  )
}
