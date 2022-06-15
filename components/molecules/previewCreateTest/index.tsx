import { CSSProperties, useContext, useRef, useState } from 'react'

import { MdContentCopy } from 'react-icons/md'
import { Button, Input, InputGroup, Modal } from 'rsuite'

import { PreviewQuestionCard } from 'components/atoms/previewQuestionCard'
import templateSampleData from 'data/templates.json'
import { PreviewResultContext, UnitTestContext } from 'interfaces/contexts'
import { TASK_SELECTIONS } from 'interfaces/struct'
import { copyText, randomIntFromInterval } from 'utils'

import { Block } from '../../atoms/block/index'

type PropsType = {
  className?: string
  style?: CSSProperties
}

type SectionDataType = {
  id: number
  content: any
  total?: number
}

type PreviewModalStateType = null | 'create' | 'replace'

type ItemPropType = {
  index: number
}

export const PreviewCreateTest = ({ className = '', style }: PropsType) => {
  const { templateDetailData, step } = useContext(UnitTestContext)

  const defaultSectionData: SectionDataType[] = []

  const [previewModal, setPreviewModal] = useState(
    null as PreviewModalStateType,
  )

  const handleSubmit = () => {
    setPreviewModal('create')
  }

  return (
    <PreviewResultContext.Provider
      value={{
        previewModal: { state: previewModal, setState: setPreviewModal },
      }}
    >
      <div className={`m-preview-create-test ${className}`} style={style}>
        {templateDetailData.state.sections.map((section: any) =>
          section.parts.map((part: any) => (
            <Block
              key={part.id}
              title={section?.content?.name || ''}
              className="__section"
            >
              <div className="__section-question">
                {part?.questions &&
                  part.questions.map((question: any, i: number) => (
                    <PreviewQuestionCard
                      key={question.id}
                      index={i + 1}
                      data={question}
                    />
                  ))}
              </div>
            </Block>
          )),
        )}
        {/* {defaultSectionData.map((section: SectionDataType) => (
          <Block
            key={section.id}
            title={section?.content?.name || ''}
            className="__section"
          >
            <div className="__section-question">
              {Array.from(Array(section.total), (e, j: number) => (
                <PreviewQuestionCard index={j + 1} />
              ))}
            </div>
          </Block>
        ))} */}
        <div className="__direction-btn">
          <Button className="__btn --back" onClick={() => step.setState(1)}>
            Back
          </Button>
          <Button className="__btn --create" onClick={() => handleSubmit()}>
            Create
          </Button>
        </div>
        <Modal
          className="replace-question-modal"
          open={previewModal === 'replace' ? true : false}
          onClose={() => setPreviewModal(null)}
        >
          <Modal.Header>
            <Modal.Title>Change other question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="__table">
              <div className="__thead">
                <div className="__tr">
                  <div className="__th" style={{ flex: 1 }}></div>
                  <div className="__th" style={{ flex: 1 }}>
                    #
                  </div>
                  <div className="__th" style={{ flex: 14 }}>
                    QUESTION
                  </div>
                  <div className="__th" style={{ flex: 8 }}>
                    QUESTION TYPE
                  </div>
                </div>
              </div>
              <div className="__tbody">
                {Array.from(Array(20), (e, i) => (
                  <TableItem key={i} index={i} />
                ))}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="__cancel" onClick={() => setPreviewModal(null)}>
              Cancel
            </Button>
            <Button
              color="blue"
              appearance="primary"
              className="__save"
              onClick={() => setPreviewModal(null)}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          className="share-unittest-modal"
          open={previewModal === 'create' ? true : false}
          onClose={() => setPreviewModal(null)}
        >
          <Modal.Header closeButton={false}>
            <Modal.Title style={{ textAlign: 'center' }}>Share</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="__link">
              <Input value="https://practicetest.eduhome.com.vn/grade-zX7/test-qxnlr" />
              <InputGroup.Button
                onClick={() =>
                  copyText(
                    'https://practicetest.eduhome.com.vn/grade-zX7/test-qxnlr',
                  )
                }
              >
                <MdContentCopy />
              </InputGroup.Button>
            </InputGroup>
          </Modal.Body>
        </Modal>
      </div>
    </PreviewResultContext.Provider>
  )
}

const TableItem = ({ index }: ItemPropType) => {
  const radio = useRef<HTMLInputElement>(null)

  return (
    <div className="__tr" onClick={() => radio.current.click()}>
      <div className="__td" style={{ flex: 1 }}>
        <input ref={radio} type="radio" name="question-name" />
      </div>
      <div className="__td" style={{ flex: 1 }}>
        {index + 1}
      </div>
      <div className="__td" style={{ flex: 14 }}>
        Question {index + 1}
      </div>
      <div className="__td" style={{ flex: 8 }}>
        {
          TASK_SELECTIONS[randomIntFromInterval(0, TASK_SELECTIONS.length - 1)]
            .display
        }
      </div>
    </div>
  )
}
