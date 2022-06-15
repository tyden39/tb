import { BLOCK_BOTTOM_GRADIENT_WITH_HEADER_TYPE } from '../../../interfaces/types'

export const BlockBottomGradientWithHeader = ({
  className = '',
  style,
  customChildren,
  headerChildren,
  children,
}) => {
  return (
    <div
      className={`pt-o-block-bottom-gradient-with-header ${className}`}
      style={style}
    >
      <div className="pt-o-block-bottom-gradient-with-header__header">
        {headerChildren}
      </div>
      <div className="pt-o-block-bottom-gradient-with-header__content">
        {children}
      </div>
      {customChildren}
    </div>
  )
}

BlockBottomGradientWithHeader.propTypes = BLOCK_BOTTOM_GRADIENT_WITH_HEADER_TYPE
