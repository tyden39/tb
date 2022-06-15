import { BLOCK_WAVE_TYPE } from '../../../interfaces/types'

export const BlockWave = ({ className = '', style, children }) => {
  return (
    <div className={`pt-o-block-wave ${className}`} style={style}>
      {children}
    </div>
  )
}

BlockWave.propTypes = BLOCK_WAVE_TYPE
