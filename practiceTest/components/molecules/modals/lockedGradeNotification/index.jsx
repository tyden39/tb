import { useContext } from 'react'

import { Modal } from 'rsuite'

import {
  APP_EDUHOME_URL,
  PREFIX_APP_KEY,
} from '../../../../interfaces/constants'
import { PageGradeContext } from '../../../../interfaces/contexts'
import { LOCKED_GRADE_NOTIFICATION_TYPE } from '../../../../interfaces/types'
import { CustomButton } from '../../../atoms/button'
import { CustomHeading } from '../../../atoms/heading'
import { CustomImage } from '../../../atoms/image'
import { CustomText } from '../../../atoms/text'

export const LockedGradeNotification = ({ data, status }) => {
  const { name } = data
  const { state, setState } = status

  const { identify } = useContext(PageGradeContext)

  const handleSubmit = () => {
    const url =
      APP_EDUHOME_URL[
        identify?.AppId ? PREFIX_APP_KEY + identify.AppId : 'default'
      ]
    window.open(url)
  }

  return (
    <Modal
      className="pt-m-locked-grade-notification"
      backdropClassName="pt-m-locked-grade-notification__backdrop"
      backdrop={true}
      dialogClassName="pt-m-locked-grade-notification__dialog"
      open={state}
      size="xs"
      onClose={() => setState(false)}
    >
      <Modal.Body className="__body">
        <CustomImage
          className="__main-icon"
          alt="locked"
          src="/pt/images/collections/clt-lock.png"
          yRate={0}
        />
        <div className="__content">
          <CustomHeading tag="h5" className="__title">
            {name} is locked
          </CustomHeading>
          <CustomText tag="p" className="__description">
            This Grade has not been activated. <br /> Please purchase products
            at Eduhome.
          </CustomText>
        </div>
      </Modal.Body>
      <Modal.Footer className="__footer">
        <CustomButton
          className="__btn --cancel"
          appearance="ghost"
          onClick={() => setState(false)}
        >
          Cancel
        </CustomButton>
        <CustomButton
          className="__btn --submit"
          appearance="primary"
          onClick={() => handleSubmit()}
        >
          Eduhome
        </CustomButton>
      </Modal.Footer>
    </Modal>
  )
}

LockedGradeNotification.propTypes = LOCKED_GRADE_NOTIFICATION_TYPE
