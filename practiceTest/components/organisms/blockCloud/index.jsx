import { BLOCK_CLOUD_TYPE } from '../../../interfaces/types'
import { CustomImage } from '../../atoms/image'

export const BlockCloud = ({ className, style, children }) => {
  return (
    <div className={`pt-o-block-cloud ${className}`} style={style}>
      <div className="pt-o-block-cloud__container">{children}</div>
      <div className="pt-o-block-cloud__yellow">
        <CustomImage
          alt="yellow bubble"
          src="/pt/images/backgrounds/bg-yellow-blur-circle.png"
        />
      </div>
      <div className="pt-o-block-cloud__blue">
        <CustomImage
          alt="blue bubble"
          src="/pt/images/backgrounds/bg-blue-blur-circle.png"
        />
      </div>
      <div className="pt-o-block-cloud__green">
        <CustomImage
          alt="green bubble"
          src="/pt/images/backgrounds/bg-green-blur-circle.png"
        />
      </div>
    </div>
  )
}

BlockCloud.propTypes = BLOCK_CLOUD_TYPE
