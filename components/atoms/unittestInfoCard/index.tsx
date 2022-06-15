import { useContext, useState } from 'react'

import { SingleTemplateContext, WrapperContext } from 'interfaces/contexts'
import { GRADE_SELECTIONS } from 'interfaces/struct'

import useNoti from '../../../hooks/useNoti'
import { DefaultPropsType } from '../../../interfaces/types'
import { formatDate } from '../../../utils/string'
import { CheckBox } from '../checkbox'
import { DateInput } from '../dateInput'
import { InputWithLabel } from '../inputWithLabel'
import { SelectPicker } from '../selectPicker'

export const UnittestInfoCard = ({
  className = '',
  style,
}: DefaultPropsType) => {
  const { getNoti } = useNoti()

  const { globalModal } = useContext(WrapperContext)
  const { chosenTemplate, mode } = useContext(SingleTemplateContext)

  const defaultId = chosenTemplate.state?.id || null
  const defaultUserId = chosenTemplate.state?.author || null
  const defaultName = chosenTemplate.state?.name || ''
  const defaultTime = chosenTemplate.state?.time || ''
  const defaultTotalQuestion = chosenTemplate.state?.totalQuestion || ''
  const defaultPoint = chosenTemplate.state?.totalPoints || ''
  const defaultGrade = GRADE_SELECTIONS.find(
    (item) => item.code === chosenTemplate.state?.templateLevelId,
  ) || { code: '', display: '' }
  const defaultDate = chosenTemplate.state?.date || [null, null]

  const [gradeReverse, setGradeReverse] = useState(false)

  const getShareUrl = () => {
    if (!defaultId || !defaultUserId) return ''
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = hostname === 'localhost' ? `:${window.location.port}` : ''
    return `${protocol}//${hostname}${port}/practice-test/${defaultUserId}===${defaultId}`
  }

  const handleNameChange = (str: string) => {
    let detail = chosenTemplate.state
    if (!detail) detail = {}
    detail.name = str
    chosenTemplate.setState({ ...detail })
  }

  const handleTimeChange = (str: string) => {
    const parseValue = parseInt(str || '0')
    if (parseValue <= 0) getNoti('error', 'topEnd', 'Thời gian phải lớn hơn 0')
    let detail = chosenTemplate.state
    if (!detail) detail = {}
    detail.time = parseValue
    chosenTemplate.setState({ ...detail })
  }

  const handleTotalQuestionChange = (value: any) => {
    const parseValue = parseInt(value || '0')
    if (parseValue <= 0)
      getNoti('error', 'topEnd', 'Tổng số câu hỏi phải lớn hơn 0')
    const detail = chosenTemplate.state || {}
    detail.totalQuestion = parseValue
    chosenTemplate.setState(detail)
  }

  const handleGradeChange = (value: string | number | null) => {
    if (
      chosenTemplate.state?.templateLevelId &&
      chosenTemplate.state.templateLevelId !== value
    ) {
      globalModal.setState({
        id: 'confirm-modal',
        type: 'change-grade',
        content: {
          closeText: 'Giữ lại đề thi',
          submitText: 'Đổi khối lớp',
          onClose: () => setGradeReverse(!gradeReverse),
          onSubmit: () => {
            let detail = chosenTemplate.state
            if (!detail) detail = {}
            detail.templateLevelId = value
            detail.sections.forEach((section: any) => {
              section.parts[0].questions = []
            })
            chosenTemplate.setState({ ...detail })
          },
        },
      })
      return
    }
    let detail = chosenTemplate.state
    if (!detail) detail = {}
    detail.templateLevelId = value
    chosenTemplate.setState({ ...detail })
  }

  const handlePointChange = (str: string) => {
    const parseValue = parseFloat(str || '0')
    if (parseValue <= 0) getNoti('error', 'topEnd', 'Tổng điểm phải lớn hơn 0')
    let detail = chosenTemplate.state
    if (!detail) detail = {}
    detail.point = parseValue
    detail.totalPoints = parseValue
    chosenTemplate.setState({ ...detail })
  }

  const handleStartDateChange = (timestamp: number) => {
    let detail = chosenTemplate.state
    if (!detail) detail = {}
    const currentDateValue: any[] = detail.date || [null, null]
    currentDateValue[0] = timestamp
    detail.date = currentDateValue
    chosenTemplate.setState({ ...detail })
  }

  const handleEndDateChange = (timestamp: number) => {
    let detail = chosenTemplate.state
    if (!detail) detail = {}
    const currentDateValue: any[] = detail.date || [null, null]
    currentDateValue[1] = timestamp
    detail.date = currentDateValue
    chosenTemplate.setState({ ...detail })
  }

  const checkActive = () => {
    const detail = chosenTemplate.state
    if (!detail?.date || detail.date.length < 1) return false
    const startDate = detail.date[0]
    const endDate = detail.date[1]
    if (!startDate) return false
    const d = new Date()
    const currentTime = d.getTime()
    if (currentTime < startDate) return false
    if (endDate) {
      if (
        (startDate > currentTime &&
          formatDate(startDate) !== formatDate(currentTime)) ||
        (endDate < currentTime &&
          formatDate(endDate) !== formatDate(currentTime))
      )
        return false
    }
    return true
  }

  if (['detail', 'update'].includes(mode) && !chosenTemplate.state) return <></>

  return (
    <div className={`a-template-info-card ${className}`} style={style}>
      <div className="a-template-info-card__container">
        <InputWithLabel
          className="mainbox"
          defaultValue={defaultName}
          disabled={mode === 'detail'}
          label="Tên đề thi"
          type="text"
          onBlur={handleNameChange}
          style={{ zIndex: 7 }}
        />
        <SelectPicker
          className="midbox"
          data={GRADE_SELECTIONS}
          defaultValue={defaultGrade}
          disabled={mode === 'detail'}
          label="Khối lớp"
          reverseData={gradeReverse}
          onChange={handleGradeChange}
          style={{ zIndex: 6 }}
        />
        <InputWithLabel
          className="subbox"
          decimal={0}
          defaultValue={defaultTime}
          disabled={mode === 'detail'}
          label="Thời gian"
          min={0}
          type="number"
          onBlur={handleTimeChange}
          style={{ zIndex: 5 }}
        />
        <InputWithLabel
          className="subbox"
          defaultValue={defaultTotalQuestion}
          disabled={mode === 'detail'}
          label="Số câu hỏi"
          type="number"
          min={0}
          onBlur={handleTotalQuestionChange}
          style={{ zIndex: 4 }}
        />
        <InputWithLabel
          className="subbox"
          decimal={2}
          defaultValue={defaultPoint}
          disabled={mode === 'detail'}
          label="Tổng điểm"
          min={0}
          type="number"
          onBlur={handlePointChange}
          style={{ zIndex: 3 }}
        />
        <DateInput
          className="midbox"
          defaultValue={defaultDate[0] || null}
          disabled={mode === 'detail'}
          label="Ngày bắt đầu"
          onChange={handleStartDateChange}
          style={{ zIndex: 2 }}
        />
        <DateInput
          className="midbox"
          defaultValue={defaultDate[1] || null}
          disabled={mode === 'detail'}
          label="Ngày kết thúc"
          onChange={handleEndDateChange}
          style={{ zIndex: 1 }}
        />
        <div className="subbox __checkbox">
          <CheckBox checked={checkActive()} disabled={true} />
          <span>Hoạt động</span>
        </div>
      </div>
      {['detail', 'update'].includes(mode) && (
        <InputWithLabel
          className="mainbox"
          defaultValue={getShareUrl()}
          disabled={true}
          iconPlacement="end"
          label="URL"
          type="text"
          style={{ maxWidth: '50rem', marginBottom: '1.6rem' }}
          onBlur={handleNameChange}
          onClick={() => {
            navigator.clipboard.writeText(getShareUrl())
            getNoti('success', 'topEnd', 'Đã copy URL')
          }}
          icon={<img src="/images/icons/ic-copy-active.png" alt="url" />}
        />
      )}
    </div>
  )
}
