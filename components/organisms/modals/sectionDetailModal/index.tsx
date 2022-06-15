import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/dist/client/router'
import { Button, Modal } from 'rsuite'

import { PartCard } from 'components/atoms/partCard'
import { SelectPicker } from 'components/atoms/selectPicker'
import { PartTabControl } from 'components/molecules/partTabControl'
import { SingleTemplateContext, WrapperContext } from 'interfaces/contexts'
import { SKILLS_SELECTIONS } from 'interfaces/struct'
import { DefaultPropsType } from 'interfaces/types'

import { StructType } from '../../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  isActive: boolean
}

export const SectionDetailModalContext = createContext(null)

export const SectionDetailModal = ({
  className = '',
  isActive,
  style,
}: PropsType) => {
  const router = useRouter()

  const { globalModal, templateDetail } = useContext(WrapperContext)
  const SingleTemplateContextData = useContext(SingleTemplateContext)

  const chosenTemplate = SingleTemplateContextData?.chosenTemplate

  const contextData =
    router.query?.templateSlug === 'create-new-unittest'
      ? chosenTemplate
      : templateDetail

  const [activeTab, setActiveTab] = useState(null)
  const [partList, setPartList] = useState([] as any[])
  const [sectionNameValue, setSectionNameValue] = useState(null as any)

  const originInput = useRef<any>(null)

  const filterSectionList = () => {
    const detailData = contextData.state
    if (!detailData?.sections) return SKILLS_SELECTIONS
    const selectedCodes = detailData.sections.map((item: any) => item.sectionId)
    return SKILLS_SELECTIONS.filter(
      (item: StructType) => !selectedCodes.includes(item.code),
    )
  }

  const handleModalClose = () => {
    if (!globalModal.state?.content?.isAdd) {
      const originDetail = JSON.parse(originInput.current.value)
      contextData.setState({ ...originDetail })
    }
    setSectionNameValue('')
    setPartList([])
    globalModal.setState(null)
  }

  const handleSectionIdChange = (value: string | number | null) => {
    setSectionNameValue(value)
  }

  const handleSubmit = () => {
    const detail = contextData.state || {}
    if (!detail?.sections || !Array.isArray(detail.sections))
      detail.sections = []
    if (globalModal.state?.content?.isAdd)
      detail.sections.push({
        id: Math.random(),
        sectionId: sectionNameValue,
        parts: partList,
        isAdded: true,
      })
    else {
      const updateIndex = detail.sections.findIndex(
        (item: any) => item.sectionId === globalModal.state?.content?.sectionId,
      )
      if (updateIndex !== -1) {
        detail.sections[updateIndex] = {
          id: detail.sections[updateIndex]?.id || null,
          sectionId: sectionNameValue,
          parts: partList,
          isAdded: true,
        }
      }
    }
    contextData.setState({ ...detail })
    setSectionNameValue('')
    setPartList([])
    globalModal.setState(null)
  }

  useEffect(() => {
    if (globalModal.state?.content?.sectionId) {
      const currentSectionId = globalModal.state.content.sectionId

      const defaultFilter = contextData.state?.sections
        ? contextData.state.sections.filter(
            (item: any) => item?.sectionId === currentSectionId,
          )
        : []
      const defaultData =
        defaultFilter.length > 0
          ? defaultFilter[0]
          : { sectionId: null as any, parts: [] as any[] }
      setSectionNameValue(defaultData.sectionId)
      setActiveTab(defaultData.parts.length > 0 ? defaultData.parts[0].id : '')
      setPartList([...defaultData.parts])
    }
    if (originInput?.current) {
      const originValue = originInput.current.value
      if (!originValue)
        originInput.current.value = JSON.stringify(contextData.state)
    }
  }, [globalModal.state])

  return (
    <SectionDetailModalContext.Provider
      value={{
        activeTab: { state: activeTab, setState: setActiveTab },
        partList: { state: partList, setState: setPartList },
      }}
    >
      <Modal
        className={`o-section-detail-modal ${className}`}
        open={isActive}
        size="xs"
        style={style}
        onClose={() => handleModalClose()}
      >
        <Modal.Body>
          <div className="modal-title">Section Information</div>
          <input ref={originInput} type="hidden" />
          <div className="modal-content">
            <div className="modal-input">
              <SelectPicker
                data={filterSectionList()}
                defaultValue={
                  SKILLS_SELECTIONS.filter(
                    (item) =>
                      item.code === globalModal.state?.content?.sectionId,
                  ).length > 0
                    ? SKILLS_SELECTIONS.filter(
                        (item) =>
                          item.code === globalModal.state?.content?.sectionId,
                      )[0]
                    : { code: '', display: '' }
                }
                label="Select section"
                name="section-id"
                onChange={handleSectionIdChange}
              />
            </div>
            <div className="modal-tab-control">
              <PartTabControl />
            </div>
            <div
              className={`modal-tab-content ${
                partList.length <= 0 ? '--invisible' : ''
              }`}
            >
              {partList.map(
                (item: any) =>
                  activeTab === item.id && (
                    <PartCard
                      key={item.id}
                      data={item}
                      mode={
                        router.query?.templateSlug === 'create-new-unittest'
                          ? 'unittest'
                          : 'template'
                      }
                      currentSkill={sectionNameValue}
                    />
                  ),
              )}
            </div>
          </div>
          <div className="modal-footer">
            <Button
              appearance="primary"
              color="blue"
              disabled={!sectionNameValue || partList.length <= 0}
              onClick={() => handleSubmit()}
            >
              {globalModal.state?.content?.isAdd ? 'Add' : 'Save'}
            </Button>
            <Button onClick={() => handleModalClose()}>Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>
    </SectionDetailModalContext.Provider>
  )
}
