import { useContext, useState } from 'react'

import { Button } from 'rsuite'

import { WrapperContext } from '../../../interfaces/contexts'
import { DefaultPropsType, StructType } from '../../../interfaces/types'
import { InputWithLabel } from '../inputWithLabel'
import { MultiSelectPicker } from '../selectPicker/multiSelectPicker'

interface PropsType extends DefaultPropsType {
  id: number
  feature?: 'unittest' | 'template'
  isActive?: boolean
  isDisabled?: boolean
  name?: string
  points?: number
  skill?: StructType[]
  skillList?: StructType[]
  type?: 'default' | 'add'
  totalQuestion?: number
  onAdd?: () => void
  onChooseQuestion?: () => void
  onDelete?: () => void
  onNameChange?: (id: number, val: string) => void
  onPointsChange?: (id: number, val: string) => void
  onSkillChange?: (
    id: number,
    val: any[],
    reverse: boolean,
    reverseFunc: (boo: boolean) => void,
  ) => void
  onTotalQuestionChange?: (id: number, val: string) => void
}

const skillThumbnails: any = {
  GR: '/images/collections/clt-grammar.png',
  LI: '/images/collections/clt-listening.png',
  PR: '/images/collections/clt-pronunciation.png',
  RE: '/images/collections/clt-reading.png',
  SP: '/images/collections/clt-speaking.png',
  US: '/images/collections/clt-use-of-english.png',
  VO: '/images/collections/clt-vocab.png',
  WR: '/images/collections/clt-writing.png',
}

export const SectionToggle = ({
  className = '',
  id,
  feature = 'unittest',
  isActive = false,
  isDisabled = false,
  name = '',
  points,
  skill,
  skillList = [],
  type = 'default',
  totalQuestion,
  style,
  onAdd = () => null,
  onChooseQuestion = () => null,
  onDelete = () => null,
  onNameChange = () => null,
  onPointsChange = () => null,
  onSkillChange = () => null,
  onTotalQuestionChange = () => null,
}: PropsType) => {
  const { globalModal } = useContext(WrapperContext)

  const [skillReverse, setSkillReverse] = useState(false)
  const [currentTotalQuestion, setCurrentTotalQuestion] =
    useState(totalQuestion)

  const handleNameChange = (val: string) =>
    onNameChange && onNameChange(id, val)

  const handleTotalQuestionType = (val: string) =>
    setCurrentTotalQuestion(parseInt(val))

  const handleTotalQuestionChange = (val: string) =>
    onTotalQuestionChange && onTotalQuestionChange(id, val)

  const handleSkillChange = (val: any[]) => {
    onSkillChange && onSkillChange(id, val, skillReverse, setSkillReverse)
  }

  const handlePointsChange = (val: string) =>
    onPointsChange && onPointsChange(id, val)

  return (
    <div
      className={`a-section-toggle ${className}`}
      data-type={type}
      data-status={
        skill && skill.length > 0
          ? isActive
            ? 'active'
            : 'default'
          : 'unknown'
      }
      style={style}
      onClick={() => type === 'add' && onAdd && onAdd()}
    >
      {type === 'add' && (
        <div className="a-section-toggle__add" data-feature={feature}>
          <img src="/images/icons/ic-plus-sub.png" alt="plus" />
          <span>Thêm mới</span>
        </div>
      )}
      {type === 'default' && (
        <div className="a-section-toggle__container">
          <div className="a-section-toggle__top">
            <InputWithLabel
              className="info-input"
              defaultValue={name}
              disabled={isDisabled}
              label="Tên phần thi"
              type="text"
              onChange={handleNameChange}
            />
          </div>
          <div className="a-section-toggle__mid">
            <div
              className="a-section-toggle__icons"
              data-amount={
                skill.length >= 4 ? 4 : skill.length <= 0 ? 1 : skill.length
              }
            >
              {skill.filter((item: StructType, i) => i < 4).length > 0 ? (
                skill
                  .filter((item: StructType, i) => i < 4)
                  .map((item: StructType, i) => (
                    <div key={i} className="__icon">
                      {skill.length <= 4 || i < 3 ? (
                        <img
                          src={
                            skillThumbnails[item?.code || ''] ||
                            '/images/collections/clt-unknown.png'
                          }
                          alt={item?.display || 'unknown'}
                        />
                      ) : (
                        <span className="tmp-icon">+{skill.length - 3}</span>
                      )}
                    </div>
                  ))
              ) : (
                <div className="__icon">
                  <img
                    src="/images/collections/clt-unknown.png"
                    alt="unknown"
                  />
                </div>
              )}
            </div>
            <div className="a-section-toggle__inputs">
              <MultiSelectPicker
                className="info-select"
                data={skillList}
                defaultValue={skill}
                disabled={isDisabled}
                displayAll={false}
                label="Kỹ năng"
                placeholder="Chọn kỹ năng"
                reverseData={skillReverse}
                onChange={handleSkillChange}
              />
              <InputWithLabel
                className="info-input"
                defaultValue={totalQuestion}
                disabled={isDisabled}
                label="Số câu hỏi"
                min={0}
                type="number"
                onBlur={handleTotalQuestionChange}
                onChange={handleTotalQuestionType}
              />
              <InputWithLabel
                className="info-input"
                decimal={2}
                defaultValue={points}
                disabled={isDisabled}
                label="Điểm"
                min={0}
                type="number"
                onBlur={handlePointsChange}
              />
            </div>
          </div>
          {feature === 'unittest' && (
            <div className="a-section-toggle__bottom">
              <Button
                className="popup-toggle"
                disabled={
                  skill.length <= 0 ||
                  !currentTotalQuestion ||
                  currentTotalQuestion <= 0
                }
                onClick={onChooseQuestion}
              >
                <img
                  src={
                    isActive
                      ? '/images/icons/ic-show-white.png'
                      : '/images/icons/ic-question-white.png'
                  }
                  alt="questions"
                />
                <span>{isActive ? 'Xem câu hỏi' : 'Chọn câu hỏi'}</span>
              </Button>
            </div>
          )}
        </div>
      )}
      {type === 'default' && !isDisabled && (
        <Button
          className="delete-btn"
          appearance="link"
          onClick={() =>
            globalModal.setState({
              id: 'confirm-modal',
              type: 'delete-skill',
              content: {
                closeText: 'Quay lại',
                submitText: 'Xoá phần thi',
                onSubmit: onDelete,
              },
            })
          }
        >
          <img src="/images/icons/ic-close-dark.png" alt="delete" />
        </Button>
      )}
    </div>
  )
}
