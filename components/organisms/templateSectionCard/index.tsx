import { useContext } from 'react'

import { SectionToggle } from 'components/atoms/sectionToggle'
import { SingleTemplateContext } from 'interfaces/contexts'
import { SKILLS_SELECTIONS } from 'interfaces/struct'
import { DefaultPropsType } from 'interfaces/types'

interface Props extends DefaultPropsType {
  isReady?: boolean
}

export const TemplateSectionCard = ({
  className = '',
  isReady = false,
  style,
}: Props) => {
  const { templateDetail, mode } = useContext(SingleTemplateContext)

  const sectionList = templateDetail.state?.sections || []

  const filterSkill = (ids: any[]) => {
    return SKILLS_SELECTIONS.filter((item) => ids.includes(item.code))
  }

  const handleSectionAdd = () => {
    const detail = templateDetail.state
    const sections = detail.sections
    console.log(detail)
    const currentUnitPoint = detail?.point || 0
    const currentUnitTotalQuestion = detail?.totalQuestion || 0

    let partPoints = 0
    let partTotalQuestion = 0
    sections.forEach((item: any) => {
      partPoints += item?.parts[0]?.points || 0
      partTotalQuestion += item?.parts[0]?.totalQuestion || 0
    })

    console.log(
      partPoints,
      partTotalQuestion,
      (partPoints || partPoints === 0) &&
        currentUnitPoint &&
        partPoints < currentUnitPoint
        ? currentUnitPoint - partPoints
        : null,
    )
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
        sectionId: [],
      },
    ]
    detail.sections = [...newSections]

    templateDetail.setState({ ...detail })
  }

  const handleSectionDelete = (id: number) => {
    const detail = templateDetail.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const sections = detail.sections.filter((item: any) => item.id !== id)
    detail.sections = [...sections]
    templateDetail.setState({ ...detail })
  }

  const handleSectionNameChange = (id: number, val: string) => {
    const detail = templateDetail.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const findIndex = detail.sections.findIndex((item: any) => item?.id === id)
    if (findIndex === -1) return
    detail.sections[findIndex].parts[0].name = val
    templateDetail.setState({ ...detail })
  }

  const handleSectionPointsChange = (id: number, val: string) => {
    const detail = templateDetail.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const findIndex = detail.sections.findIndex((item: any) => item?.id === id)
    if (findIndex === -1) return
    detail.sections[findIndex].parts[0].points = parseFloat(val)
    templateDetail.setState({ ...detail })
  }

  const handleSectionSkillChange = (id: number, val: any[]) => {
    const detail = templateDetail.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const findIndex = detail.sections.findIndex((item: any) => item?.id === id)
    if (findIndex === -1) return
    detail.sections[findIndex].sectionId = [...val]
    templateDetail.setState({ ...detail })
  }

  const handleSectionTotalQuestionChange = (id: number, val: string) => {
    const detail = templateDetail.state
    if (!detail?.sections || !Array.isArray(detail.sections)) return
    const findIndex = detail.sections.findIndex((item: any) => item?.id === id)
    if (findIndex === -1) return
    console.log(detail)
    detail.sections[findIndex].parts[0].totalQuestion = parseInt(val)
    templateDetail.setState({ ...detail })
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
              feature="template"
              isActive={
                item?.sectionId &&
                item?.sectionId.length > 0 &&
                item?.parts[0]?.name &&
                item?.parts[0]?.points &&
                item?.parts[0]?.totalQuestion
                  ? true
                  : false
              }
              isDisabled={mode === 'detail'}
              name={item?.parts[0]?.name}
              skill={filterSkill(item.sectionId)}
              skillList={SKILLS_SELECTIONS}
              totalQuestion={item?.parts[0]?.totalQuestion}
              points={item?.parts[0]?.points}
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
              feature="template"
              type="add"
              onAdd={handleSectionAdd}
            />
          </div>
        )}
      </div>
    </div>
  )
}
