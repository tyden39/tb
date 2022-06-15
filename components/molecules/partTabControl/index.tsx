import { useContext, useEffect } from 'react'

import PlusRoundIcon from '@rsuite/icons/PlusRound'
import { Nav } from 'rsuite'

import { PartTab } from 'components/atoms/partTab'
import { SectionDetailModalContext } from 'components/organisms/modals/sectionDetailModal'

import { DefaultPropsType } from '../../../interfaces/types'

const createSampleData = (id: number) => ({
  id,
  name: '',
  questionTypes: '',
  totalQuestion: 0,
  points: 0,
  questions: [] as any[],
})

export const PartTabControl = ({ className = '', style }: DefaultPropsType) => {
  const { activeTab, partList }: any = useContext(SectionDetailModalContext)

  const handleAddPart = () => {
    const parts = partList.state
    const newId = Math.random()
    parts.push(createSampleData(newId))
    activeTab.setState(newId)
    partList.setState([...parts])
  }

  useEffect(() => {
    handleAddPart()
  }, [])

  return (
    <div className={`m-part-tab-control --hidden ${className}`} style={style}>
      <Nav appearance="tabs">
        {partList.state.map((item: any) => (
          <PartTab
            key={item.id}
            data={item}
            isActive={activeTab.state === item.id}
          />
        ))}
        <Nav.Item className="add-tab-btn" onSelect={() => handleAddPart()}>
          <span>Add new part</span>
          <PlusRoundIcon />
        </Nav.Item>
      </Nav>
    </div>
  )
}
