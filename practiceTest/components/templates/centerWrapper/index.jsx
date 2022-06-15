import { BLOCK_CENTER_TYPE } from '../../../interfaces/types'

export const CenterWrapper = ({ className = '', style, children }) => {
  return (
    <div className={`pt-t-center-wrapper ${className}`} style={style}>
      {children}
    </div>
  )
}

CenterWrapper.propTypes = BLOCK_CENTER_TYPE
