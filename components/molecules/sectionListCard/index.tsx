import { useContext } from 'react'

import { Card } from 'components/atoms/card'
import { SectionToggle } from 'components/atoms/sectionToggle'
import { WrapperContext } from 'interfaces/contexts'

import { SKILLS_SELECTIONS } from '../../../interfaces/struct'
import { DefaultPropsType } from '../../../interfaces/types'

export const SectionListCard = ({
  className = '',
  style,
}: DefaultPropsType) => {
  const { templateDetail } = useContext(WrapperContext)

  const sectionList = templateDetail.state?.sections || []

  const filterSkill = (id: string) => {
    const findIndex = SKILLS_SELECTIONS.findIndex((item) => item.code === id)
    if (findIndex === -1) return { code: 'unknown', display: 'Unknown' }
    return SKILLS_SELECTIONS[findIndex]
  }

  return (
    <Card
      className={`m-section-list-card ${className}`}
      title="Sections"
      style={style}
    >
      <div className="card-container">
        {sectionList.length < SKILLS_SELECTIONS.length && (
          <div className="container-toggle">
            {/* <SectionToggle className="toggle-btn" type="add" /> */}
          </div>
        )}
        {sectionList.map((item: any) => (
          <div key={item.sectionId} className="container-toggle">
            {/* <SectionToggle
              className="toggle-btn"
              data={filterSkill(item.sectionId)}
            /> */}
          </div>
        ))}
      </div>
    </Card>
  )
}
