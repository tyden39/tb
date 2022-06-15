import { useContext } from 'react'

import { toaster } from 'rsuite'

import { WrapperContext } from 'interfaces/contexts'
import { GRADE_SELECTIONS } from 'interfaces/struct'

import { DefaultPropsType } from '../../../interfaces/types'
import { AlertNoti } from '../alertNoti/index'
import { Card } from '../card'
import { InputWithLabel } from '../inputWithLabel'
import { SelectPicker } from '../selectPicker'

export const TemplateInfoCard = ({
  className = '',
  style,
}: DefaultPropsType) => {
  const { templateDetail } = useContext(WrapperContext)

  const defaultName = templateDetail.state?.name || ''
  const defaultTime = templateDetail.state?.time || ''
  const defaultTotalQuestion = templateDetail.state?.totalQuestion || ''
  const defaultGrade = GRADE_SELECTIONS.find(
    (item) => item.code === templateDetail.state?.templateLevelId,
  ) || { code: '', display: '' }

  const warning = (type: any, message: any) => {
    const key = toaster.push(<AlertNoti type={type} message={message} />, {
      placement: 'topEnd',
    })
    setTimeout(() => toaster.remove(key), 2000)
  }

  const handleNameChange = (str: string) => {
    let detail = templateDetail.state
    if (!detail) detail = {}
    detail.name = str
    templateDetail.setState({ ...detail })
  }

  const handleTimeChange = (str: string) => {
    const parseValue = parseInt(str || '0')
    if (isNaN(parseValue)) {
      warning('warning', 'Time value must be a number!!!')
      return
    }
    let detail = templateDetail.state
    if (!detail) detail = {}
    detail.time = parseValue
    templateDetail.setState({ ...detail })
  }

  const handleTotalQuestionChange = (value: any) => {
    const parseValue = parseInt(value || '0')
    if (isNaN(parseValue)) {
      warning('warning', 'Total question value must be a number!!!')
      return
    }
    const detail = templateDetail.state || {}
    detail.totalQuestion = parseValue
    templateDetail.setState({ ...detail })
  }

  const handleGradeChange = (value: string | number | null) => {
    let detail = templateDetail.state
    if (!detail) detail = {}
    detail.templateLevelId = value
    templateDetail.setState({ ...detail })
  }

  return (
    <Card
      className={`a-template-info-card ${className}`}
      title="Template Information"
      style={style}
    >
      <div className="a-template-info-card__input">
        <InputWithLabel
          label="Name"
          defaultValue={defaultName}
          type="text"
          onBlur={handleNameChange}
        />
      </div>
      <div className="a-template-info-card__input input-group">
        <InputWithLabel
          className="input-50"
          label="Time"
          defaultValue={defaultTime}
          type="number"
          onBlur={handleTimeChange}
        />
        <InputWithLabel
          className="input-50"
          label="Total questions"
          defaultValue={defaultTotalQuestion}
          type="number"
          onBlur={handleTotalQuestionChange}
        />
      </div>
      <div className="a-template-info-card__input">
        <SelectPicker
          data={GRADE_SELECTIONS}
          defaultValue={defaultGrade}
          label="Grade"
          onChange={handleGradeChange}
        />
      </div>
    </Card>
  )
}
