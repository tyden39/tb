import { useContext } from 'react'

import { PageTestContext } from '../../../interfaces/contexts'
import { BLOCK_GAME_TYPE } from '../../../interfaces/types'
import { CenterWrapper } from '../../templates/centerWrapper'

export const GameWrapper = ({ className = '', style, children }) => {
  const { mode } = useContext(PageTestContext)

  return (
    <CenterWrapper className={`pt-t-game-wrapper ${className}`} style={style}>
      {children}
    </CenterWrapper>
  )
}

GameWrapper.propTypes = BLOCK_GAME_TYPE
