import { STATUS_GRADE_ICON } from '../../../interfaces/constants'
import { CARD_GRADE_TYPE } from '../../../interfaces/types'
import { CustomHeading } from '../../atoms/heading'
import { CustomImage } from '../../atoms/image'
import { CustomLink } from '../../atoms/link'
import { CustomText } from '../../atoms/text'

export const CardGrade = ({ data, openModal }) => {
  const { isDisabled, name, slug } = data

  return (
    <CustomLink
      className={`pt-m-card-grade ${isDisabled ? '--disabled' : ''}`}
      as={`/${slug}`}
      href={'/[gradeId]'}
      isPrevent={isDisabled}
      onClick={openModal}
    >
      <div className="pt-m-card-grade__backdrop"></div>
      <div className="pt-m-card-grade__banner">
        <CustomImage
          className="__img"
          alt="grade banner"
          src="/pt/images/collections/clt-grade.png"
          yRate={109}
        />
      </div>
      {name && (
        <CustomHeading tag="h6" className="pt-m-card-grade__name">
          {name}
        </CustomHeading>
      )}
      {/* {description && (
        <CustomText tag="p" className="pt-m-card-grade__description">
          {description}
        </CustomText>
      )} */}
      <div className="pt-m-card-grade__direction">
        <CustomText tag="span" className="__text">
          {isDisabled ? 'Locked' : 'Do the tests'}
        </CustomText>
        <CustomImage
          className="__icon"
          alt={
            isDisabled
              ? STATUS_GRADE_ICON.disabled.alt
              : STATUS_GRADE_ICON.normal.alt
          }
          src={
            isDisabled
              ? STATUS_GRADE_ICON.disabled.src
              : STATUS_GRADE_ICON.normal.src
          }
          yRate={0}
        />
      </div>
    </CustomLink>
  )
}

CardGrade.propTypes = CARD_GRADE_TYPE
