import { BLOCK_BOTTOM_GRADIENT_TYPE } from '../../../interfaces/types'

export const BlockBottomGradient = ({
  className = '',
  aos,
  style,
  children,
}) => {
  return (
    <div
      className={`pt-o-block-bottom-gradient ${className}`}
      data-animate={aos?.name || ''}
      style={style}
    >
      {children}
    </div>
  )
}

BlockBottomGradient.propTypes = BLOCK_BOTTOM_GRADIENT_TYPE
