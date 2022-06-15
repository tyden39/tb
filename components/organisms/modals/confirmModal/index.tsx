import { useContext } from 'react'

import { Button, Modal } from 'rsuite'

import { WrapperContext } from 'interfaces/contexts'
import { DefaultPropsType } from 'interfaces/types'

interface PropsType extends DefaultPropsType {
  isActive?: boolean
}

const data = [
  {
    banner: '/images/collections/clt-change-grade.png',
    description: (
      <>
        Tất cả câu hỏi đã chọn sẽ bị xóa.
        <br />
        Bạn có chắc chắn muốn thay đổi khối lớp?
      </>
    ),
    title: 'Đổi khối lớp',
    type: 'change-grade',
  },
  {
    banner: '/images/collections/clt-change-grade.png',
    description: (
      <>
        Tất cả câu hỏi đã chọn sẽ bị xóa.
        <br />
        Bạn có chắc chắn muốn thay đổi kỹ năng?
      </>
    ),
    title: 'Đổi kỹ năng',
    type: 'change-skill',
  },
  {
    banner: '/images/collections/clt-delete-section.png',
    description: (
      <>
        Tất cả câu hỏi đã chọn sẽ bị xóa.
        <br />
        Bạn có chắc chắn muốn xóa phần thi này?
      </>
    ),
    title: 'Xoá phần thi',
    type: 'delete-skill',
  },
  {
    banner: '/images/collections/clt-cancel.png',
    description: (
      <>
        Bạn có chắc chắn muốn xoá đề thi này.
        <br />
        Hành động này không thể hoàn tác
      </>
    ),
    title: 'Xoá đề thi',
    type: 'delete-unit-test',
  },
  {
    banner: '/images/collections/clt-cancel.png',
    description: (
      <>
        Bạn có chắc chắn muốn xoá cấu trúc này.
        <br />
        Hành động này không thể hoàn tác
      </>
    ),
    title: 'Xoá cấu trúc',
    type: 'delete-template',
  },
  {
    banner: '/images/collections/clt-back.png',
    description: (
      <>
        Tất cả nội dung sẽ bị xóa.
        <br /> Bạn có chắc chắn muốn quay lại
      </>
    ),
    title: 'Quay lại bước 1',
    type: 'move-to-first-step',
  },
  {
    banner: '/images/collections/clt-cancel.png',
    description: (
      <>
        Bạn có chắc chắn muốn xoá câu hỏi này.
        <br />
        Hành động này không thể hoàn tác
      </>
    ),
    title: 'Xoá câu hỏi',
    type: 'delete-question',
  },
  {
    banner: '/images/collections/clt-cancel.png',
    description: (
      <>
        Bạn có chắc chắn muốn xoá người dùng này.
        <br />
        Hành động này không thể hoàn tác
      </>
    ),
    title: 'Xoá',
    type: 'delete-user',
  },
]

export const ConfirmModal = ({
  className = '',
  isActive,
  style,
}: PropsType) => {
  const { globalModal } = useContext(WrapperContext)

  const type = globalModal.state?.type || ''
  const findingData = data.find((item) => item.type === type)

  const handleClose = () => {
    if (globalModal.state?.content?.onClose) {
      globalModal.state.content.onClose()
    }
    globalModal.setState(null)
  }

  const handleSubmit = () => {
    if (globalModal.state?.content?.onSubmit) {
      globalModal.state.content.onSubmit()
    }
    globalModal.setState(null)
  }

  if (!type || !findingData) return <></>

  return (
    <Modal
      className={`o-confirm-modal ${className}`}
      open={isActive}
      style={style}
      onClose={handleClose}
    >
      <Modal.Body>
        <div className="modal-toggle" onClick={handleClose}>
          <img src="/images/icons/ic-close-dark.png" alt="close" />
        </div>
        <div className="modal-content">
          <div className="modal-banner">
            <img src={findingData.banner} alt="delete" />
          </div>
          <h5 className="modal-title">{findingData.title}</h5>
          <p className="modal-description">{findingData.description}</p>
        </div>
        <div className="modal-footer">
          <Button
            className="secondary"
            appearance="primary"
            color="blue"
            onClick={handleSubmit}
          >
            {globalModal.state?.content?.submitText || 'Xác nhận'}
          </Button>
          <Button
            className="primary"
            appearance="primary"
            color="blue"
            onClick={handleClose}
          >
            {globalModal.state?.content?.closeText || 'Hủy'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
