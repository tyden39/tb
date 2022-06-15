import { useContext, useState } from 'react'

import { CheckBox } from 'components/atoms/checkbox'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { SelectPicker } from 'components/atoms/selectPicker'
import useNoti from 'hooks/useNoti'
import { SingleTemplateContext, WrapperContext } from 'interfaces/contexts'
import { GRADE_SELECTIONS } from 'interfaces/struct'
import { DefaultPropsType } from 'interfaces/types'

interface Props extends DefaultPropsType {
  isReady: boolean
}

export const TemplateInfoCard = ({ className = '', isReady, style }: Props) => {
  const { getNoti } = useNoti()

  const { globalModal } = useContext(WrapperContext)
  const { mode, templateDetail } = useContext(SingleTemplateContext)

  const defaultName = templateDetail.state?.name || ''
  const defaultTime = templateDetail.state?.time || ''
  const defaultTotalQuestion = templateDetail.state?.totalQuestion || ''
  const defaultPoint = templateDetail.state?.point || ''
  const defaultGrade = GRADE_SELECTIONS.find(
    (item) => item.code === templateDetail.state?.templateLevelId,
  ) || { code: '', display: '' }

  const [gradeReverse, setGradeReverse] = useState(false)

  const handleNameChange = (str: string) => {
    let detail = templateDetail.state
    if (!detail) detail = {}
    detail.name = str
    templateDetail.setState({ ...detail })
  }

  const handleTimeChange = (str: string) => {
    const parseValue = parseInt(str || '0')
    if (parseValue <= 0) getNoti('error', 'topEnd', 'Thời gian phải lớn hơn 0')
    let detail = templateDetail.state
    if (!detail) detail = {}
    detail.time = parseValue
    templateDetail.setState({ ...detail })
  }

  const handleTotalQuestionChange = (value: any) => {
    const parseValue = parseInt(value || '0')
    if (parseValue <= 0)
      getNoti('error', 'topEnd', 'Tổng số câu hỏi phải lớn hơn 0')
    const detail = templateDetail.state || {}
    detail.totalQuestion = parseValue
    templateDetail.setState(detail)
  }

  const handleGradeChange = (value: string | number | null) => {
    if (
      isReady &&
      templateDetail.state?.sections &&
      templateDetail.state.sections.length > 0 &&
      templateDetail.state?.templateLevelId &&
      templateDetail.state.templateLevelId !== value
    ) {
      globalModal.setState({
        id: 'confirm-modal',
        type: 'change-grade',
        content: {
          closeText: 'Giữ lại đề thi',
          submitText: 'Đổi khối lớp',
          onClose: () => setGradeReverse(!gradeReverse),
          onSubmit: () => {
            let detail = templateDetail.state
            if (!detail) detail = {}
            detail.templateLevelId = value
            templateDetail.setState({ ...detail })
          },
        },
      })
      return
    }
    let detail = templateDetail.state
    if (!detail) detail = {}
    detail.templateLevelId = value
    templateDetail.setState({ ...detail })
  }

  const handlePointChange = (str: string) => {
    const parseValue = parseFloat(str || '0')
    if (parseValue <= 0) getNoti('error', 'topEnd', 'Tổng điểm phải lớn hơn 0')
    let detail = templateDetail.state
    if (!detail) detail = {}
    detail.point = parseValue
    templateDetail.setState({ ...detail })
  }

  const handleStatusChange = () => {
    const detail = templateDetail.state
    if ([true, false].includes(detail?.status)) {
      const currentValue = detail.status
      detail.status = !currentValue
    } else {
      detail.status = true
    }
    templateDetail.setState({ ...detail })
  }

  if (['detail', 'update'].includes(mode) && !templateDetail.state?.id)
    return <></>

  return (
    <div className={`a-template-info-card ${className}`} style={style}>
      <div className="a-template-info-card__container">
        <InputWithLabel
          className="mainbox"
          defaultValue={defaultName}
          disabled={mode === 'detail'}
          label="Tên cấu trúc"
          type="text"
          onBlur={handleNameChange}
          style={{ maxWidth: '36rem' }}
        />
        <SelectPicker
          className="midbox"
          data={GRADE_SELECTIONS}
          defaultValue={defaultGrade}
          disabled={mode === 'detail'}
          label="Khối lớp"
          reverseData={gradeReverse}
          onChange={handleGradeChange}
        />
        <InputWithLabel
          className="midbox"
          decimal={0}
          defaultValue={defaultTime}
          disabled={mode === 'detail'}
          label="Thời gian"
          min={0}
          type="number"
          onBlur={handleTimeChange}
        />
        <InputWithLabel
          className="midbox"
          defaultValue={defaultTotalQuestion}
          disabled={mode === 'detail'}
          label="Số câu hỏi"
          type="number"
          min={0}
          onBlur={handleTotalQuestionChange}
        />
        <InputWithLabel
          className="midbox"
          decimal={2}
          defaultValue={defaultPoint}
          disabled={mode === 'detail'}
          label="Tổng điểm"
          min={0}
          type="number"
          onBlur={handlePointChange}
        />
        <div className="midbox __checkbox">
          <CheckBox
            checked={templateDetail.state?.status ? true : false}
            disabled={mode === 'detail'}
            onChange={handleStatusChange}
          />
          <span>Hoạt động</span>
        </div>
      </div>
    </div>
  )
}
