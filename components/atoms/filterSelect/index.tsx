import { useState } from 'react'

import CloseIcon from '@rsuite/icons/Close'
import PageNextIcon from '@rsuite/icons/PageNext'
import { Button, Dropdown } from 'rsuite'

import { DefaultPropsType, StructType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  defaultValue?: StructType | null
  data: StructType[]
  name: string
  placeholder?: string
  onSelect?: () => void
}

export const FilterSelect = ({
  className = '',
  defaultValue,
  data,
  name,
  placeholder = '',
  style,
  onSelect,
}: PropsType) => {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className={`a-filter-select ${className}`} style={style}>
      <input
        data-role="filter-input"
        type="hidden"
        name={name}
        value={value?.code || ''}
      />
      {data.length > 0 && (
        <Dropdown
          renderToggle={(props, ref) => (
            <Button className="rs-dropdown-toggle" {...props} ref={ref}>
              <span>{value?.display || placeholder}</span>
              {value && (
                <CloseIcon
                  className="reset-btn"
                  color={'red'}
                  onClick={(e) => {
                    e.stopPropagation()
                    setValue(null)
                    setTimeout(() => {
                      onSelect()
                    }, 0)
                  }}
                />
              )}
              <PageNextIcon className="caret-toggle" />
            </Button>
          )}
          onSelect={(eventKey: StructType) => {
            setValue(eventKey)
            setTimeout(() => {
              onSelect()
            }, 0)
          }}
        >
          {data.map((item) => (
            <Dropdown.Item key={item.code} eventKey={item}>
              {item.display}
            </Dropdown.Item>
          ))}
        </Dropdown>
      )}
    </div>
  )
}
