import { useState } from 'react'

import CloseIcon from '@rsuite/icons/Close'

import { TASK_SELECTIONS } from 'interfaces/struct'

import { DefaultPropsType, StructType } from '../../../interfaces/types'
import { SelectPicker } from '../selectPicker'

interface PropsType extends DefaultPropsType {
  data: StructType[]
  defaultValue?: StructType[]
  label: string
  name: string
  onChange?: (value: any) => void
}

export const TagPicker = ({
  className = '',
  data,
  defaultValue = [],
  label,
  name,
  style,
  onChange = () => null,
}: PropsType) => {
  const [tagList, setTagList] = useState(defaultValue)

  const handleChange = (value: any) => {
    const strValue = value.join(',')
    onChange(strValue)
  }

  const handleSelectChange = (value: any) => {
    const tags = tagList.filter((item) => item !== value)
    tags.push(value)
    handleChange(tags)
    setTagList([...tags])
  }

  const handleTagDelete = (value: any) => {
    const tags = tagList.filter((item) => item !== value)
    handleChange(tags)
    setTagList([...tags])
  }

  return (
    <div className={`a-tag-picker ${className}`} style={style}>
      <div className="a-tag-picker__main">
        <SelectPicker
          className="select"
          checkValue={tagList.length > 0}
          data={data.filter((item: any) => !tagList.includes(item.code))}
          hiddenValue={true}
          isMultiChoice={true}
          name={name}
          label={label}
          onChange={handleSelectChange}
        />
      </div>
      {tagList.length > 0 && (
        <div className="a-tag-picker__container">
          {tagList.map((item: any) => (
            <Tag key={item} data={item} onDelete={handleTagDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

interface TagPropsType extends DefaultPropsType {
  data: any
  onDelete?: (value: string | number) => void
}

const Tag = ({ className = '', data, style, onDelete }: TagPropsType) => {
  const findingDisplay = TASK_SELECTIONS.filter((item) => item.code === data)
  const tagDisplay =
    findingDisplay.length > 0 ? findingDisplay[0].display : data

  return (
    <div className={`tag ${className}`} style={style}>
      <span>{tagDisplay}</span>
      <CloseIcon className="tag__delete-icon" onClick={() => onDelete(data)} />
    </div>
  )
}
