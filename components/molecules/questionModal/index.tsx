import { useContext, useState } from 'react'

import { Button, Modal } from 'rsuite'

import { FilterSelect } from 'components/atoms/filterSelect'
import {
  FORMAT_SELECTIONS,
  GRADE_SELECTIONS,
  LEVEL_SELECTIONS,
  PUBLISHER_SELECTIONS,
  SERIES_SELECTIONS,
} from 'interfaces/struct'

import { UnitTestContext } from '../../../interfaces/contexts'
import { DefaultPropsType } from '../../../interfaces/types'
import { FilterQuestionTable } from '../filterQuesionTable'

interface PropsType extends DefaultPropsType {
  isOpen: boolean
  data: any[]
  max?: number
  onClose: () => void
}

export const QuestionModal = ({
  className = '',
  isOpen,
  max = 0,
  data,
  style,
  onClose,
}: PropsType) => {
  const { templateDetailData } = useContext(UnitTestContext)

  const [dataList, setDataList] = useState([] as any[])

  const [checkExistFilter, setCheckExistFilter] = useState(false)

  const handleFilterChange = async () => {
    const positionData = templateDetailData.state?.questionPosition
      ? templateDetailData.state.questionPosition.split(',')
      : ''

    const section = templateDetailData.state.sections.filter(
      (item: any) => item.sectionId === positionData[0],
    )

    let part = [] as any[]
    section.forEach((item: any) => {
      const findingPart = item.parts.filter(
        (fp: any) => `${fp.id}` === positionData[1],
      )
      part = part.concat(findingPart)
    })
    const questionTypeList = part[0].questionTypes.split(',')
    const filterInput = document.querySelectorAll(
      'input[data-role="filter-input"]',
    )

    const filterList = {} as any
    filterList.question_type = questionTypeList
    filterList.skills = positionData[0]
    for (let i = 0; i < filterInput.length; i++) {
      const item = filterInput[i]
      const name = item.getAttribute('name')
      const value = item.getAttribute('value')
      switch (name) {
        case 'filter-publisher':
          if (value) filterList['publisher'] = value
          break
        case 'filter-serie':
          if (value) filterList['series'] = value
          break
        case 'filter-level':
          if (value) filterList['level'] = value
          break
        case 'filter-grade':
          if (value) filterList['grade'] = value
          break
        case 'filter-test-format':
          if (value) filterList['format'] = value
          break
        default:
          break
      }
    }
    let count = 0 as number
    for (const key in filterList) {
      if (filterList.hasOwnProperty(key)) count++
    }
    setCheckExistFilter(count > 0 ? true : false)
    filterList['page'] = 0
    await fetch('/api/questions/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filterList),
    })
      .then((res) => res.json())
      .then((data) => {
        setDataList(data?.data || [])
      })
  }

  const handleCancel = () => {
    setDataList([])
    setCheckExistFilter(false)
    onClose()
  }

  return (
    <Modal
      className={`m-question-modal ${className}`}
      backdrop={false}
      open={isOpen}
      style={style}
      onClose={() => handleCancel()}
    >
      <Modal.Header>
        <Modal.Title>Question List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="filter-row">
          <div className="filter-item">
            <FilterSelect
              name="filter-publisher"
              data={PUBLISHER_SELECTIONS}
              placeholder="Publisher"
              onSelect={handleFilterChange}
            />
          </div>
          <div className="filter-item">
            <FilterSelect
              name="filter-serie"
              data={SERIES_SELECTIONS}
              placeholder="Series"
              onSelect={handleFilterChange}
            />
          </div>
          <div className="filter-item">
            <FilterSelect
              name="filter-level"
              data={LEVEL_SELECTIONS}
              placeholder="Level"
              onSelect={handleFilterChange}
            />
          </div>
          <div className="filter-item">
            <FilterSelect
              name="filter-grade"
              data={GRADE_SELECTIONS}
              placeholder="Grade"
              onSelect={handleFilterChange}
            />
          </div>
          <div className="filter-item">
            <FilterSelect
              name="filter-test-format"
              data={FORMAT_SELECTIONS}
              placeholder="Test Format"
              onSelect={handleFilterChange}
            />
          </div>
        </div>
        <div className="filter-table">
          <FilterQuestionTable
            data={
              checkExistFilter || (dataList && dataList.length > 0)
                ? dataList
                : data
            }
            max={max}
            style={{ height: '100%' }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" onClick={() => onClose()}>
          Ok
        </Button>
        <Button onClick={() => handleCancel()} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
