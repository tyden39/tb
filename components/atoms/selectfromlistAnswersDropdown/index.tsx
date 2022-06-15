import { useState } from 'react'

import { SELECT_FROM_LIST_ANSWERS } from 'practiceTest/interfaces/constants'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any
  selected: string
}

export const SLAnswersDropdown = ({
  className = '',
  data,
  selected,
  style,
}: PropsType) => {
  return (
    <div className={`a-sl-dropdown ${className}`} style={style}>
      <select value={selected} className="a-sl-dropdown__option">
        {data.map((item: string, i: number) => (
          <option
            key={i}
            className={item === selected ? 'answer' : ''}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}
