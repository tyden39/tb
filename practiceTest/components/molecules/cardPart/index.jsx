import { CARD_PART_TYPE } from '../../../interfaces/types'
import { CustomHeading } from '../../atoms/heading'
import { CustomText } from '../../atoms/text'

export const CardPart = ({ data, index }) => {
  const { name, point } = data

  return (
    <div className="pt-m-card-part">
      <div className="pt-m-card-part__info">
        <CustomText tag="span" className="__label">
          Part {index}
        </CustomText>
        <CustomHeading tag="h6" className="__name">
          {name}
        </CustomHeading>
      </div>
      <div className="pt-m-card-part__point">
        <CustomText tag="span" className="__point">
          {point > 1 ? `${point} points` : `${point} point`}
        </CustomText>
      </div>
    </div>
  )
}

CardPart.propTypes = CARD_PART_TYPE
