import { useContext, useRef } from 'react'

import CloseIcon from '@rsuite/icons/Close'
import { Button, Nav, Popover, Whisper } from 'rsuite'

import { SectionDetailModalContext } from 'components/organisms/modals/sectionDetailModal'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data: any
  isActive?: boolean
}

export const PartTab = ({
  className = '',
  data,
  isActive = false,
  style,
}: PropsType) => {
  const { activeTab, partList } = useContext(SectionDetailModalContext)

  const popover = useRef<any>(null)

  const handlePartDelete = () => {
    const parts = partList.state.filter((item: any) => item.id !== data.id)
    // if (data.id === activeTab.state && parts.length > 0) {
    //   activeTab.setState(parts[0].id)
    // }
    // ask mr Sang for help
    partList.setState([...parts])
    popover.current.close()
  }

  return (
    <Nav.Item
      className={`a-part-tab ${className} ${isActive ? '--active' : ''}`}
      style={style}
      onSelect={() => activeTab.setState(data.id)}
    >
      <span>{data.name}</span>
      <Whisper
        ref={popover}
        controlId={data.id}
        placement="rightStart"
        trigger="click"
        speaker={
          <Popover title="Warning">
            <div style={{ maxWidth: 150, marginBottom: 12 }}>
              Are you sure you want to delete this part?
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{ marginLeft: 12, color: '#d12f1d', cursor: 'pointer' }}
                onClick={() => handlePartDelete()}
              >
                Delete
              </span>
              <span
                style={{ marginLeft: 12, color: '#6a6f76', cursor: 'pointer' }}
                onClick={() => popover.current.close()}
              >
                Cancel
              </span>
            </div>
          </Popover>
        }
      >
        <Button
          className="delete-btn"
          appearance="link"
          onClick={(e) => e.stopPropagation()}
        >
          <CloseIcon
            style={{
              width: '1.2rem',
              height: '1.2rem',
              transform: 'translateY(-0.2rem)',
            }}
          />
        </Button>
      </Whisper>
    </Nav.Item>
  )
}
