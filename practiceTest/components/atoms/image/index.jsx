import { CUSTOM_IMAGE_TYPE } from '../../../interfaces/types'

export const CustomImage = ({
  alt,
  className = '',
  fit = 'contain',
  position = 'center',
  src,
  yRate = 100,
  onClick = () => null,
}) => {
  let yRateValue = 0
  if (yRate > 100) yRateValue = 100
  else if (yRate < 0) yRateValue = 0
  else yRateValue = yRate

  return (
    <div
      className={`pt-a-image ${className}`}
      style={{ paddingTop: `${yRateValue}%` }}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        style={{
          objectFit: fit,
          objectPosition: position,
        }}
      />
    </div>
  )
}

CustomImage.propTypes = CUSTOM_IMAGE_TYPE
