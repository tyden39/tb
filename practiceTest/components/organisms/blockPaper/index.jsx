import { Scrollbars } from 'react-custom-scrollbars'

import { BLOCK_PAPER_TYPE } from '../../../interfaces/types'
import { CustomImage } from '../../atoms/image'

export const BlockPaper = ({ className = '', style, children }) => {
  return (
    <div className={`pt-o-block-paper ${className}`} style={style}>
      <div className="pt-o-block-paper__container">
        <Scrollbars universal={true}>{children}</Scrollbars>
      </div>
      <div className="__paper">
        <CustomImage
          className="__paper-image"
          alt="paper"
          fit="fill"
          src="/pt/images/backgrounds/bg-paper.png"
        />
      </div>
      <div className="__pin --left">
        <CustomImage
          className="__pin-image"
          alt="pin"
          src="/pt/images/collections/clt-pin.png"
          yRate={115}
        />
      </div>
      <div className="__pin --right">
        <CustomImage
          className="__pin-image"
          alt="pin"
          src="/pt/images/collections/clt-pin.png"
          yRate={115}
        />
      </div>
    </div>
  )
}

BlockPaper.propTypes = BLOCK_PAPER_TYPE
