import { useContext, useState } from 'react'

import { Button, Checkbox, Pagination, toaster } from 'rsuite'

import { SectionDetailModalContext } from 'components/organisms/modals/sectionDetailModal'
import { WrapperContext } from 'interfaces/contexts'
import {
  GRADE_SELECTIONS,
  LEVEL_SELECTIONS,
  PUBLISHER_SELECTIONS,
  SERIES_SELECTIONS,
  TEMPLATE_LEVEL_SELECTIONS,
} from 'interfaces/struct'
import { DefaultPropsType } from 'interfaces/types'

import { AlertNoti } from '../alertNoti'
import { InputWithLabel } from '../inputWithLabel'
import { SelectPicker } from '../selectPicker'

interface PropsType extends DefaultPropsType {
  data?: any
  mode?: 'template' | 'unittest'
  currentSkill?: string
}

export const PartCard = ({
  className = '',
  data,
  mode = 'template',
  currentSkill = '',
  style,
}: PropsType) => {
  const { activeTab, partList } = useContext(SectionDetailModalContext)

  const [isOpenQuestion, setIsOpenQuestion] = useState(false)
  const [questionData, setQuestionData] = useState(null)

  const warning = (type: any, message: any) => {
    const key = toaster.push(<AlertNoti type={type} message={message} />, {
      placement: 'topEnd',
    })
    setTimeout(() => toaster.remove(key), 2000)
  }

  const handleNameChange = (value: any) => {
    const parts = partList.state
    if (!Array.isArray(parts)) return
    const findIndex = parts.findIndex((item) => item.id === activeTab.state)
    if (findIndex === -1) return
    parts[findIndex].name = value
    partList.setState([...parts])
  }

  const handleTotalChange = (value: any) => {
    const parts = partList.state
    if (!Array.isArray(parts)) return
    const findIndex = parts.findIndex((item) => item.id === activeTab.state)
    if (findIndex === -1) return
    const totalQuestion = parseInt(value || 0)
    parts[findIndex].totalQuestion = totalQuestion !== NaN ? totalQuestion : 0
    partList.setState([...parts])
  }

  const handlePointChange = (value: any) => {
    const parts = partList.state
    if (!Array.isArray(parts)) return
    const findIndex = parts.findIndex((item) => item.id === activeTab.state)
    if (findIndex === -1) return
    const points = parseFloat(value || '0')
    parts[findIndex].points = points !== NaN ? points : 0
    partList.setState([...parts])
  }

  const chooseQuestion = async () => {
    const parts = partList.state
    if (!Array.isArray(parts)) return
    const findIndex = parts.findIndex((item) => item.id === activeTab.state)
    if (findIndex === -1) return
    if (parts[findIndex].totalQuestion <= 0) {
      warning('warning', 'Total question must be more than 0!!!')
      return
    }
    const skills = currentSkill
    if (skills)
      await fetch('/api/questions/search', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 0, skills }),
      })
        .then((res) => {
          if (res?.status === 200) return res.json()
        })
        .then((result) => {
          setQuestionData(result)
          setIsOpenQuestion(true)
        })
  }

  const changeCheckbox = (tr: any, boo: boolean) => {
    const partData = partList.state
    if (boo) {
      if (!partData[0]?.questions) partData[0].questions = [] as any[]
      partData[0].questions.push(tr)
    } else {
      if (!partData[0]?.questions) partData[0].questions = [] as any[]
      else {
        const filter = partData[0].questions.filter(
          (item: any) => item.id !== tr.id,
        )
        partData[0].questions = filter
      }
    }
    partList.setState([...partData])
  }

  return (
    <div className={`a-part-card ${className}`} style={style}>
      <div className="a-part-card__col">
        <div className="a-part-card__input">
          <InputWithLabel
            label="Part name"
            defaultValue={data.name !== 'New part' ? data.name : ''}
            type="text"
            onBlur={handleNameChange}
          />
        </div>
        <div className="a-part-card__input">
          <InputWithLabel
            label="Number of questions"
            defaultValue={data.totalQuestion !== 0 ? data.totalQuestion : ''}
            type="number"
            onBlur={handleTotalChange}
          />
        </div>
        <div className="a-part-card__input">
          <InputWithLabel
            label="Points per correct answer"
            defaultValue={data.points !== 0 ? data.points : ''}
            type="number"
            onBlur={handlePointChange}
          />
        </div>
        {mode === 'unittest' && (
          <div className="a-part-card__input">
            <Button
              className="choose-question-btn"
              onClick={() => chooseQuestion()}
            >
              Choose questions
            </Button>
            {isOpenQuestion && (
              <div className="question-modal">
                <QuestionContainer
                  data={questionData}
                  onClose={setIsOpenQuestion}
                  onChange={changeCheckbox}
                  currentSkill={currentSkill}
                  chosenId={
                    partList.state[0]?.questions
                      ? partList.state[0].questions.map((item: any) => item.id)
                      : []
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
      {/* <div className="a-part-card__col">
        <div className="a-part-card__input">
          <TagPicker
            data={TASK_SELECTIONS}
            defaultValue={
              data?.questionTypes ? data.questionTypes.split(',') : []
            }
            label="Question types"
            name="question-types"
            onChange={handleQuestionTypesChange}
          />
        </div>
      </div> */}
    </div>
  )
}

const QuestionContainer = ({
  data,
  onClose,
  onChange,
  currentSkill,
  chosenId = [],
}: any) => {
  const { globalModal } = useContext(WrapperContext)

  const [tableData, setTableData] = useState(data?.data || [])
  const [totalPage, setTotalPage] = useState(data?.totalPage || 1)

  const [activePage, setActivePage] = useState(1)

  const [filterList, setFilterList] = useState({
    publisher: '',
    series: '',
    grade: '',
    skills: currentSkill,
    level: '',
  } as any)

  const close = () => {
    onClose(false)
  }

  const handlePageChange = async (page: any) => {
    const skills = globalModal.state?.content?.sectionId

    await fetch('/api/questions/search', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, skills }),
    })
      .then((res) => {
        if (res?.status === 200) return res.json()
      })
      .then((result) => {
        if (result?.data && result?.totalPage) {
          setTableData(result.data)
          setTotalPage(result?.totalPage)
          setActivePage(page)
        }
      })
  }

  const handlePublisherChange = async (value: any) => {
    const filters = { ...filterList, publisher: value }
    const finalFilter = {} as any

    for (const [key, value] of Object.entries(filters)) {
      if (value) finalFilter[key] = value
    }
    setFilterList({ ...filters })
    fetchFilter(finalFilter)
  }

  const handleSeriesChange = async (value: any) => {
    const filters = { ...filterList, series: value }
    const finalFilter = {} as any

    for (const [key, value] of Object.entries(filters)) {
      if (value) finalFilter[key] = value
    }
    setFilterList({ ...filters })
    fetchFilter(finalFilter)
  }

  const handleGradeChange = async (value: any) => {
    const filters = { ...filterList, grade: value }
    const finalFilter = {} as any

    for (const [key, value] of Object.entries(filters)) {
      if (value) finalFilter[key] = value
    }
    setFilterList({ ...filters })
    fetchFilter(finalFilter)
  }

  const handleLevelChange = async (value: any) => {
    const filters = { ...filterList, level: value }
    const finalFilter = {} as any

    for (const [key, value] of Object.entries(filters)) {
      if (value) finalFilter[key] = value
    }
    setFilterList({ ...filters })
    fetchFilter(finalFilter)
  }

  const fetchFilter = async (data: any) => {
    await fetch('/api/questions/search', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, page: 0 }),
    })
      .then((res) => {
        if (res?.status === 200) return res.json()
      })
      .then((result) => {
        setTableData(result.data)
        setTotalPage(result?.totalPage)
        setActivePage(1)
      })
  }

  return (
    <div className="question-container">
      <div className="container-header">
        <div className="modal-title">Choose questions</div>
      </div>
      <div className="container-content">
        <SelectPicker
          className="select-filter"
          data={PUBLISHER_SELECTIONS}
          label="Publisher"
          onChange={handlePublisherChange}
        />
        <SelectPicker
          className="select-filter"
          data={SERIES_SELECTIONS}
          label="Series"
          onChange={handleSeriesChange}
        />
        <SelectPicker
          className="select-filter"
          data={GRADE_SELECTIONS}
          label="Grade"
          onChange={handleGradeChange}
        />
        <SelectPicker
          className="select-filter"
          data={LEVEL_SELECTIONS}
          label="Level"
          onChange={handleLevelChange}
        />
      </div>
      <div className="container-body">
        <table>
          <thead>
            <tr>
              <th style={{ width: '5%' }}></th>
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '10%' }}>Publisher</th>
              <th style={{ width: '15%' }}>Series</th>
              <th style={{ width: '10%' }}>Grade</th>
              <th style={{ width: '10%' }}>Level</th>
              <th>Question description</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((tr: any, i: number) => (
                <tr key={tr.id}>
                  <td>
                    <Checkbox
                      defaultChecked={chosenId.includes(tr.id)}
                      onChange={(value: any, checked: boolean) =>
                        onChange(tr, checked)
                      }
                    ></Checkbox>
                  </td>
                  <td>{(activePage - 1) * 10 + (i + 1)}</td>
                  <td>
                    {PUBLISHER_SELECTIONS.find(
                      (item) => item.code === tr?.publisher,
                    )?.display || ''}
                  </td>
                  <td>
                    {SERIES_SELECTIONS.find((item) => item.code === tr?.series)
                      ?.display || ''}
                  </td>
                  <td>
                    {GRADE_SELECTIONS.find((item) => item.code === tr?.grade)
                      ?.display || ''}
                  </td>
                  <td>
                    {TEMPLATE_LEVEL_SELECTIONS.find(
                      (item) => item.code === tr?.level,
                    )?.display || ''}
                  </td>
                  <td>{tr?.question_description || ''}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPage > 1 && (
          <div className="pagination-container">
            <Pagination
              prev
              next
              size="md"
              total={totalPage * 10}
              maxButtons={10}
              limit={10}
              activePage={activePage}
              onChangePage={handlePageChange}
            />
          </div>
        )}
      </div>
      <div className="container-footer">
        <Button
          className="footer-btn"
          appearance="primary"
          color="blue"
          onClick={() => close()}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
