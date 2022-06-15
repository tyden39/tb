import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { Container, Header } from 'rsuite'

import { HEADER_TYPE } from '../../../interfaces/types'
import { CustomButton } from '../../atoms/button'
import { CustomHeading } from '../../atoms/heading'

export const CustomHeader = ({ page }) => {
  const [isBlur, setIsBlur] = useState(false)

  const router = useRouter()

  const handleBackBtnClick = () => router.push('/')

  const handleScroll = () => {
    const scrollTop = window.scrollY
    if (scrollTop < 50) setIsBlur(false)
    else setIsBlur(true)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Header className={`pt-o-header ${isBlur ? '--blur' : ''}`}>
      <Container className="pt-o-header__container">
        {page?.title && (
          <CustomHeading tag="h5" className="__heading">
            {page.title}
          </CustomHeading>
        )}
        {page?.directionBtn && page.directionBtn === 'back-home' && (
          <CustomButton
            className="__back-btn"
            appearance="ghost"
            onClick={() => handleBackBtnClick()}
          >
            Back
          </CustomButton>
        )}
        {page?.directionBtn && page.directionBtn === 'quit-app' && (
          <CustomButton className="__quit-btn" appearance="ghost">
            Quit
          </CustomButton>
        )}
      </Container>
    </Header>
  )
}

CustomHeader.propTypes = HEADER_TYPE
