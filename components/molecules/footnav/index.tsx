import { CSSProperties } from 'react'

import Link from 'next/link'

import { FOOTNAV_ITEMS } from '../../../interfaces/constants'

type PropsType = {
  className?: string
  style?: CSSProperties
}

export const Footnav = ({ className = '', style }: PropsType) => {
  return (
    <nav className={`o-footnav ${className}`} style={style}>
      {FOOTNAV_ITEMS.map((item, i) => (
        <Link key={i} href={item.url}>
          <a className="__item">{item.name}</a>
        </Link>
      ))}
    </nav>
  )
}
