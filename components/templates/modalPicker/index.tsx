import { useContext } from 'react'

import { ConfirmModal } from 'components/organisms/modals/confirmModal'
import { QuestionDrawer } from 'components/organisms/modals/questionDrawer'
import { SectionDetailModal } from 'components/organisms/modals/sectionDetailModal'
import { ShareLinkModal } from 'components/organisms/modals/shareLinkModal'
import { WrapperContext } from 'interfaces/contexts'

export const ModalPicker = () => {
  const { globalModal } = useContext(WrapperContext)

  return (
    <>
      <ConfirmModal isActive={globalModal.state?.id === 'confirm-modal'} />
      {globalModal.state?.id === 'question-drawer' && (
        <QuestionDrawer isActive={true} />
      )}
      <SectionDetailModal
        isActive={globalModal.state?.id === 'section-detail'}
      />
      {globalModal.state?.id === 'share-link' && (
        <ShareLinkModal isActive={true} />
      )}
    </>
  )
}
