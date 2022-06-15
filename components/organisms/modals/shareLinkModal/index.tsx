import { useContext, useState } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { Button, Modal } from 'rsuite'

import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { USER_ROLES } from 'interfaces/constants'
import { WrapperContext } from 'interfaces/contexts'
import { DefaultPropsType } from 'interfaces/types'
import { userInRight } from 'utils'

interface PropsType extends DefaultPropsType {
  isActive?: boolean
}

export const ShareLinkModal = ({
  className = '',
  isActive,
  style,
}: PropsType) => {
  const router = useRouter()

  const [session] = useSession()
  const isSystem = userInRight([USER_ROLES.Operator], session)

  const { globalModal } = useContext(WrapperContext)

  const id = globalModal.state?.content?.id || null
  const userId = globalModal.state?.content?.userId || null

  const [isShowNoti, setIsShowNoti] = useState(false)

  const getShareUrl = () => {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = hostname === 'localhost' ? `:${window.location.port}` : ''
    return `${protocol}//${hostname}${port}/practice-test/${userId}===${id}`
  }

  const handleModalClose = () => {
    globalModal.setState(null)
    router.push(`/unit-test${isSystem ? '' : '?m=mine'}`)
  }

  if (!id || !userId) return <></>

  return (
    <Modal
      className={`o-share-link-modal ${className}`}
      open={isActive}
      style={style}
      onClose={() => handleModalClose()}
    >
      <Modal.Body>
        <div className="modal-header">
          <img src="/images/collections/clt-cancel-green.png" alt="banner" />
          <h5 className="modal-title">Tạo đề thi thành công</h5>
          <p className="modal-description">
            Đề thi mới đã được thêm vào danh sách đề thi có link URL như sau
          </p>
        </div>
        <div
          className="modal-content"
          onClick={() => {
            navigator.clipboard.writeText(getShareUrl())
            setIsShowNoti(true)
          }}
        >
          <InputWithLabel
            className="input-copy"
            label="Url"
            type="text"
            defaultValue={getShareUrl()}
            readOnly={true}
            iconPlacement="end"
            icon={<img src="/images/icons/ic-copy-active.png" alt="icon" />}
          />
          {isShowNoti && <span className="modal-noti">Đã copy!</span>}
        </div>
        <div className="modal-footer">
          <Button
            appearance="primary"
            color="blue"
            onClick={() => handleModalClose()}
          >
            Đi đến Danh sách đề thi
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
