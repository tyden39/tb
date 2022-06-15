import { CSSProperties, useContext, useState } from 'react'

import { AiOutlinePlus } from 'react-icons/ai'
import { Button, Dropdown, Modal, Tag } from 'rsuite'

import { paths } from 'api/paths'
import { callApi, getApiPath } from 'api/utils'
import { InputField } from 'components/atoms/inputField'
import { TemplateDetailSection } from 'components/organisms/templateDetailSection'
import { TemplateSectionsContext, UnitTestContext } from 'interfaces/contexts'
import { GRADE_SELECTIONS, SKILLS_SELECTIONS } from 'interfaces/struct'
import { SectionDataType } from 'interfaces/types'

import { PartDataType } from '../../../interfaces/types'
import { FilterQuestionTable } from '../filterQuesionTable'
import { QuestionModal } from '../questionModal/index'
import { TemplateParts } from '../templateParts'

type PropsType = {
  className?: string
  data: SectionDataType
  mode?: 'templateDetail' | 'createTemplate' | 'createUnitTest'
  style?: CSSProperties
  onDelete?: () => void
  onSelected?: (a: number, b: number) => void
}

type CustomSectionConstantType = {
  id: number
  name: string
  isSelected: boolean
}

export const TemplateSections = ({
  className = '',
  data,
  mode = 'templateDetail',
  style,
  onDelete,
  onSelected,
}: PropsType) => {
  const { templateDetailData } = useContext(UnitTestContext)

  const [originData, setOriginData] = useState(data?.parts || [])
  const createSamplePart = (id: number) => ({
    id,
    name: '',
    questionTypes: '',
    numberOfQuestions: 0,
    pointsPerCorrectAnswer: 0,
  })
  const [newData, setNewData] = useState(
    data?.parts && data.parts.length <= 0
      ? [createSamplePart(Math.random())]
      : [],
  )

  const selectedSectionData = SKILLS_SELECTIONS.filter(
    (item) => item.code === data.sectionId,
  )
  const [sectionName, setSectionName] = useState(
    selectedSectionData[0] ? selectedSectionData[0].display : '',
  )
  const [sectionId, setSectionId] = useState(data.sectionId)
  const [isOpenQuestionModal, setIsOpenQuestionModal] = useState(false)
  const [maxModalData, setMaxModalData] = useState(null)
  const [questionChooseData, setQuestionChooseData] = useState([])
  const [chosenPartQuestion, setChosenPartQuestion] = useState('')

  const handleAddTask = () => {
    const currentData = newData
    const newId = Math.random()
    currentData.push(createSamplePart(newId))
    setNewData([...currentData])
  }

  const handleDeleteTask = (id: number, isNewInput = false) => {
    if (isNewInput) {
      if (originData.length <= 0 && newData.length <= 1) {
        const newId = Math.random()
        setNewData([createSamplePart(newId)])
        return
      }
      const newFilter = newData.filter((item) => item.id !== id)
      setNewData([...newFilter])
      return
    }
    const newOrigin = originData.filter((item: PartDataType) => item.id !== id)
    if (newData.length <= 0 && newOrigin.length <= 0) handleAddTask()
    setOriginData([...newOrigin])
  }

  const handleChooseQuestion = async (e: any, max: number, position: any) => {
    templateDetailData.setState({
      ...templateDetailData.state,
      questionPosition: position,
    })
    const questionTypes = e.target
      .closest('.__part')
      .querySelector('input[name="question-types"]')
    const inputValue = questionTypes.getAttribute('value')
    const typeList = inputValue ? inputValue.split(',') : []
    const skills = e.target
      .closest('.m-template-sections')
      .querySelector('input[name="section-id"]')
      .getAttribute('value')
    await fetch('/api/questions/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 0, skills, question_type: typeList }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMaxModalData(max)
        setQuestionChooseData(data?.data || [])
        setIsOpenQuestionModal(true)
      })
  }

  return (
    <TemplateDetailSection
      className={`m-template-sections __form-container ${className}`}
      defaultShow={mode === 'createTemplate' ? true : false}
      title={sectionName || 'New section'}
      style={style}
      onDelete={
        ['createTemplate', 'templateDetail'].includes(mode)
          ? () => onDelete()
          : null
      }
    >
      <TemplateSectionsContext.Provider value={{ mode }}>
        <div className="__form-group" style={{ position: 'relative' }}>
          {['templateDetail'].includes(mode) && (
            <input type="hidden" name="template-section-id" value={data.id} />
          )}
          <input type="hidden" name="section-id" value={sectionId} />
          <InputField
            label="Section name"
            type="text"
            name="section-name"
            defaultValue={sectionName}
            //placeholder="Select section here"
            disabled={true}
          />
          {SKILLS_SELECTIONS.length > 0 && (
            <Dropdown
              className="__dropdown select-section"
              title="Select section"
              onSelect={(eventKey: any) => {
                setSectionName(eventKey.display)
                setSectionId(eventKey.code)
                onSelected(sectionId, eventKey.code)
              }}
            >
              {SKILLS_SELECTIONS.map((item: any) => (
                <Dropdown.Item key={item.code} eventKey={item}>
                  {item.display}
                </Dropdown.Item>
              ))}
            </Dropdown>
          )}
        </div>
        <hr />
        {originData.map((part: any, j: number) => (
          <div key={part.id} className="__part">
            <Tag
              style={{
                margin: '0 0 1.6rem 0',
                background: '#1ab394',
                borderRadius: 0,
                color: '#fff',
              }}
            >
              {j + 1}
            </Tag>
            {mode === 'templateDetail' && (
              <input type="hidden" name="part-id" value={part.id} />
            )}
            <div className="__form-group --mb-16">
              <InputField
                label="Part name"
                type="text"
                name="part-name"
                defaultValue={part?.name || ''}
                //placeholder="Type part name here ..."
                disabled={mode === 'createUnitTest' ? true : false}
              />
            </div>
            <div className="__dash-line"></div>
            <TemplateParts
              data={
                ['templateDetail', 'createUnitTest'].includes(mode) &&
                part?.questionTypes
                  ? part.questionTypes.split(',')
                  : []
              }
              mode={mode}
            />
            {mode === 'createUnitTest' && (
              <>
                <input
                  type="hidden"
                  data-position={`${data.sectionId},${part.id}`}
                  name="question-id-list"
                />
                <Button
                  className="show-question-btn"
                  onClick={(e) => {
                    setChosenPartQuestion(`${data.sectionId},${part.id}`)
                    handleChooseQuestion(
                      e,
                      part?.numberOfQuestions || 0,
                      `${data.sectionId},${part.id}`,
                    )
                  }}
                >
                  <span>Choose questions</span>
                </Button>
              </>
            )}
            <div className="__dash-line"></div>
            <div className="__form-group --mb-16">
              <InputField
                label="Number of questions"
                type="number"
                name="num-of-questions"
                defaultValue={part?.numberOfQuestions || 0}
                //placeholder="Type number of questions ..."
                disabled={mode === 'createUnitTest' ? true : false}
              />
            </div>
            <div className="__dash-line"></div>
            <div className="__form-group --mb-16">
              <InputField
                label="Points per correct answer"
                type="number"
                name="point-per-correct-answer"
                defaultValue={part?.pointsPerCorrectAnswer || 0}
                //placeholder="Type points/correct answer here ..."
                disabled={mode === 'createUnitTest' ? true : false}
              />
            </div>
            {['createTemplate', 'templateDetail'].includes(mode) && (
              <>
                <div className="__dash-line"></div>
                <div className="__footer">
                  <Button
                    className="__delete-part"
                    onClick={() => handleDeleteTask(part.id)}
                  >
                    <span>Delete this part</span>
                    <AiOutlinePlus />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        {newData.map((part: any, j: number) => (
          <div key={part.id} className="__part">
            <Tag
              style={{
                margin: '0 0 1.6rem 0',
                background: '#1ab394',
                borderRadius: 0,
                color: '#fff',
              }}
            >
              {originData.length + j + 1}
            </Tag>
            <div className="__form-group --mb-16">
              <InputField
                label="Part name"
                type="text"
                name="part-name"
                defaultValue={part?.name ?? ''}
                //placeholder="Type part name here ..."
              />
            </div>
            <div className="__dash-line"></div>
            <TemplateParts
              data={
                mode === 'templateDetail' && part?.questionTypes
                  ? part.questionTypes.split(',')
                  : []
              }
              mode={mode}
            />
            <div className="__dash-line"></div>
            <div className="__form-group --mb-16">
              <InputField
                label="Number of questions"
                type="number"
                name="num-of-questions"
                defaultValue={part?.numberOfQuestions ?? 0}
                //placeholder="Type number of questions here ..."
              />
            </div>
            <div className="__dash-line"></div>
            <div className="__form-group --mb-16">
              <InputField
                label="Points per correct answer"
                type="number"
                name="point-per-correct-answer"
                defaultValue={part?.pointsPerCorrectAnswer ?? 0}
                //placeholder="Type points/correct answer here ..."
              />
            </div>
            <div className="__dash-line"></div>
            <div className="__footer">
              <Button
                className="__delete-part"
                onClick={() => handleDeleteTask(part.id, true)}
              >
                <span>Delete this part</span>
                <AiOutlinePlus />
              </Button>
            </div>
          </div>
        ))}
        {
          <QuestionModal
            max={maxModalData}
            data={questionChooseData}
            isOpen={isOpenQuestionModal}
            onClose={() => setIsOpenQuestionModal(false)}
          />
        }
        {['createTemplate', 'templateDetail'].includes(mode) && (
          <div className="--mb-16">
            <Button className="__add-part" onClick={() => handleAddTask()}>
              <span>Add new part</span>
              <AiOutlinePlus />
            </Button>
          </div>
        )}
      </TemplateSectionsContext.Provider>
    </TemplateDetailSection>
  )
}
