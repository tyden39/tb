import { APP_EDUHOME_URL } from '../../../interfaces/constants'
import { CustomButton } from '../../atoms/button'
import { CustomHeading } from '../../atoms/heading'
import { CustomImage } from '../../atoms/image'
import { CustomText } from '../../atoms/text'

export const ErrorWrapper = () => {
  return (
    <div className="pt-t-error-wrapper">
      <div className="pt-t-error-wrapper__banner">
        <CustomImage
          className="__image"
          alt="Error"
          src="/pt/images/collections/clt-error.png"
          yRate={0}
        />
      </div>
      <CustomHeading tag="h5" className="pt-t-error-wrapper__title">
        Oops!! Something went wrong.
      </CustomHeading>
      <CustomText tag="span" className="pt-t-error-wrapper__description">
        This page is not working. Please try again.
      </CustomText>
      <CustomButton
        className="pt-t-error-wrapper__btn"
        onClick={() => (window.location.href = APP_EDUHOME_URL.default)}
      >
        Go To Eduhome
      </CustomButton>
    </div>
  )
}
