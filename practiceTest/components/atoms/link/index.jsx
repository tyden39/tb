import Link from 'next/link'

import { CUSTOM_LINK_TYPE } from '../../../interfaces/types'

export const CustomLink = ({
  as,
  children,
  className = '',
  href,
  isPrevent = false,
  style,
  onClick,
}) => {
  const handleClick = (e) => {
    if (isPrevent) {
      e.preventDefault()
      if (!onClick) return
      onClick()
    }
  }

  return (
    <Link href={href} as={as}>
      <a
        className={`pt-a-link ${className}`}
        style={style}
        onClick={(e) => handleClick(e)}
      >
        {children}
      </a>
    </Link>
  )
}

CustomLink.proptype = CUSTOM_LINK_TYPE
