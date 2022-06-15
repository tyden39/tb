import { CSSProperties } from 'react'

import { Footnav } from '../../molecules/footnav'

type PropsType = {
  className?: string
  style?: CSSProperties
}

export const Footer = ({ className = '', style }: PropsType) => {
  return (
    <footer className={`o-footer ${className}`} style={style}>
      <div className="__copyright">
        <span>© 2021. DTP Education </span>
      </div>
      <div className="__nav">
        <Footnav />
      </div>
    </footer>
  )
}
