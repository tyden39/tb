import { CSSProperties, useContext, useEffect, useState } from 'react'

import { AppContext } from 'interfaces/contexts'

import { DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  containerStyle?: CSSProperties
}

export const StickyFooter = ({
  className = '',
  style,
  containerStyle,
  children,
}: Props) => {
  const { isExpandSidebar } = useContext(AppContext)

  const [isBlur, setIsBlur] = useState(false)

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY + 10 >=
      document.body.offsetHeight
    ) {
      setIsBlur(false)
    } else setIsBlur(true)
  }

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`o-sticky-footer ${className}`}
      data-blur={isBlur}
      data-size={isExpandSidebar.state ? 'md' : 'lg'}
      style={style}
    >
      <div className="o-sticky-footer__container" style={containerStyle}>
        {children}
      </div>
    </div>
  )
}
