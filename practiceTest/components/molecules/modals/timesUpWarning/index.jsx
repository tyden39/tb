import { useContext } from 'react'

import { Modal } from 'rsuite'

import { TEST_MODE } from '../../../../interfaces/constants'
import { PageTestContext } from '../../../../interfaces/contexts'
import { TIMES_UP_WARNING_TYPE } from '../../../../interfaces/types'
import { formatMinutes } from '../../../../utils/functions'
import { CustomButton } from '../../../atoms/button'
import { CustomHeading } from '../../../atoms/heading'
import { CustomImage } from '../../../atoms/image'
import { CustomText } from '../../../atoms/text'

export const TimesUpWarning = ({ status, time }) => {
  const { state, setState } = status

  const { currentGroupBtn, currentPart, currentQuestion, mode } =
    useContext(PageTestContext)

  const handleSubmitClick = () => {
    currentPart.setIndex(0)
    currentQuestion.setIndex([0])
    currentGroupBtn.setIndex(0)
    mode.setState(TEST_MODE.result)
  }

  return (
    <Modal
      className="pt-m-times-up-warning"
      backdropClassName="pt-m-times-up-warning__backdrop"
      backdrop={true}
      dialogClassName="pt-m-times-up-warning__dialog"
      open={state}
      size="xs"
      onClose={() => setState(false)}
    >
      <Modal.Body className="__body">
        <CustomImage
          className="__main-icon"
          alt="sand clock"
          src="/pt/images/collections/clt-sand-clock.png"
          yRate={0}
        />
        <div className="__content">
          <CustomHeading tag="h5" className="__title">
            You only have {formatMinutes(time)} left to complete the test.
          </CustomHeading>
          <CustomText tag="p" className="__description">
            Would you like to submit now?
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
          onClick={() => handleSubmitClick()}
        >
          Submit
        </CustomButton>
      </Modal.Footer>
    </Modal>
  )
}

TimesUpWarning.propTypes = TIMES_UP_WARNING_TYPE
