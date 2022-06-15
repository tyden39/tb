import { useContext } from 'react'

import { callApi } from 'api/utils'
import { SectionToggle } from 'components/atoms/sectionToggle'
import { SingleTemplateContext, WrapperContext } from 'interfaces/contexts'

import { SKILLS_SELECTIONS } from '../../../interfaces/struct'
import { DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  isReady?: boolean
}

export const UnitSectionCard = ({
  className = '',
  isReady = false,
  style,
}: Props) => {
  const { globalModal } = useContext(WrapperContext)
  const { chosenTemplate, mode } = useContext(SingleTemplateContext)

  const sectionList = chosenTemplate.state?.sections || []

  const filterSkill = (ids: any[]) => {
    return SKILLS_SELECTIONS.filter((item) => ids.includes(item.code))
  }

  const handleChooseQuestion = async (
    id: number,
    skill: any[],
    totalQuestion: number,
    chosenQuestions: any[],
  ) => {
    const otherQuestions = [] as any[]
    chosenTemplate.state.sections.forEach((section: any) => {
      if (
        section?.id !== id &&
        section?.parts &&
        section.parts[0]?.questions &&
        section.parts[0].questions.length > 0
      ) {
        section.parts[0].questions.forEach((question: any) => {
          otherQuestions.push(question?.id)
        })
      }
    })
    const grade = chosenTemplate.state?.templateLevelId || null
    const response = await callApi('/api/questions/search', 'post', 'Token', {
      grade: [grade],
      page: 0,
      skills: skill,
      sid: chosenQuestions.map((m) => m.id),
      excludeId: otherQuestions.length > 0 ? otherQuestions : null,
    })
    if (response)
      globalModal.setState({
        id: 'question-drawer',
        content: {
          id,
          chosenQuestions,
          isDisabled: mode === 'detail',
          data: response,
          grade: chosenTemplate.state?.templateLevelId || null,
          skill,
          totalQuestion,
          onSubmit: handleQuestionDrawerSubmit,
        },
      })
  }

  const handleSectionAdd = () => {
    const detail = chosenTemplate.state
    const sections = detail.sections
    const currentUnitPoint = detail?.totalPoints || detail?.points || null
    const currentUnitTotalQuestion = detail?.totalQuestion || null
    let partPoints = 0
    let partTotalQuestion = 0
    sections.forEach((item: any) => {
      partPoints += item?.parts[0]?.points || 0
      partTotalQuestion += item?.parts[0]?.totalQuestion || 0
    })
    const newSections = [
      ...sections,
      {
        id: Math.random(),
        parts: [
          {
            id: Math.random(),
            name: '',
            points:
              (partPoints || partPoints === 0) &&
              currentUnitPoint &&
              partPoints < currentUnitPoint
                ? currentUnitPoint - partPoints
                : null,
            questions: [],
            questionTypes: '',
            totalQuestion:
              (partTotalQuestion || partTotalQuestion === 0) &&
              currentUnitTotalQuestion &&
              partTotalQuestion < currentUnitTotalQuestion
                ? currentUnitTotalQuestion - partTotalQuestion
                : null,
          },
        ],
        sectionId: '',
      },
    ]
    detail.sections = [...newSections]

    chosenTemplate.setState({ ...detail })
  }

  const handleSectionDelete = (id: number) => {
    const detail = chosenTemplate.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const sections = detail.sections.filter((item: any) => item.id !== id)
    detail.sections = [...sections]
    chosenTemplate.setState({ ...detail })
  }

  const handleSectionNameChange = (id: number, val: string) => {
    const detail = chosenTemplate.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const findIndex = detail.sections.findIndex((item: any) => item?.id === id)
    if (findIndex === -1) return
    detail.sections[findIndex].parts[0].name = val
    chosenTemplate.setState({ ...detail })
  }

  const handleSectionPointsChange = (id: number, val: string) => {
    const detail = chosenTemplate.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const findIndex = detail.sections.findIndex((item: any) => item?.id === id)
    if (findIndex === -1) return
    detail.sections[findIndex].parts[0].points = parseFloat(val)
    chosenTemplate.setState({ ...detail })
  }

  const handleSectionSkillChange = (
    id: number,
    val: any[],
    reverse: boolean,
    reverseSkill: (boo: boolean) => void,
  ) => {
    const detail = chosenTemplate.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const findIndex = detail.sections.findIndex((item: any) => item?.id === id)
    if (findIndex === -1) return
    if (
      detail.sections[findIndex].parts[0]?.questions &&
      detail.sections[findIndex].parts[0].questions.length > 0
    ) {
      globalModal.setState({
        id: 'confirm-modal',
        type: 'change-skill',
        content: {
          closeText: 'Quay lại',
          submitText: 'Xoá câu hỏi',
          onClose: () => reverseSkill(!reverse),
          onSubmit: () => {
            detail.sections[findIndex].sectionId = [...val]
            detail.sections[findIndex].parts[0].questions = []
            chosenTemplate.setState({ ...detail })
          },
        },
      })
      return
    }
    detail.sections[findIndex].sectionId = val
    detail.sections[findIndex].parts[0].questions = []
    chosenTemplate.setState({ ...detail })
  }

  const handleSectionTotalQuestionChange = (id: number, val: string) => {
    const detail = chosenTemplate.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const findIndex = detail.sections.findIndex((item: any) => item?.id === id)
    if (findIndex === -1) return
    detail.sections[findIndex].parts[0].totalQuestion = parseInt(val)
    chosenTemplate.setState({ ...detail })
  }

  const handleQuestionDrawerSubmit = (skill: string, data: any[]) => {
    const detail = chosenTemplate.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const findIndex = detail.sections.findIndex(
      (item: any) => item?.sectionId === skill,
    )
    if (findIndex === -1) return
    detail.sections[findIndex].parts[0].questions = data
    chosenTemplate.setState({ ...detail })
    globalModal.setState(null)
  }

  const getTotalSentence = (arr: any[]) => {
    let totalChosenSentence = 0
    if (arr) {
      arr.forEach((item) => {
        if (item?.total_question) totalChosenSentence += item.total_question
      })
    }
    return totalChosenSentence
  }

  return (
    <div className={`m-section-list-card ${className}`} style={style}>
      <div
        className="card-container"
        data-ready={isReady}
        data-warning-content='Vui lòng nhập "Thông tin chung" trước khi thêm kỹ năng'
      >
        {sectionList.map((item: any, i: number) => (
          <div
            key={item.id}
            className={`container-toggle ${item.id}`}
            style={{ zIndex: sectionList.length - i }}
          >
            <SectionToggle
              className="toggle-btn"
              id={item.id}
              isActive={
                item?.parts[0]?.name &&
                item?.parts[0]?.questions &&
                item?.parts[0]?.totalQuestion &&
                getTotalSentence(item.parts[0].questions) ===
                  item.parts[0].totalQuestion
                  ? true
                  : false
              }
              isDisabled={mode === 'detail'}
              name={item?.parts[0]?.name}
              skill={filterSkill(item.sectionId)}
              skillList={SKILLS_SELECTIONS}
              totalQuestion={item?.parts[0]?.totalQuestion}
              points={item?.parts[0]?.points}
              onChooseQuestion={() =>
                handleChooseQuestion(
                  item.id,
                  item.sectionId,
                  item?.parts[0]?.totalQuestion,
                  item?.parts[0]?.questions || [],
                )
              }
              onDelete={() => handleSectionDelete(item.id)}
              onNameChange={handleSectionNameChange}
              onPointsChange={handleSectionPointsChange}
              onSkillChange={handleSectionSkillChange}
              onTotalQuestionChange={handleSectionTotalQuestionChange}
            />
          </div>
        ))}
        {['create', 'update'].includes(mode) && (
          <div className="container-toggle">
            <SectionToggle
              className="toggle-btn"
              id={0}
              type="add"
              onAdd={handleSectionAdd}
            />
          </div>
        )}
      </div>
    </div>
  )
}
