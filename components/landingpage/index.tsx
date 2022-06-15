import { useEffect } from 'react'
import AOS from 'aos'
import { LandingFeatures } from './Features'
import { LandingPageContact } from './contact'
import { LandingFooter } from './Footer'
import { LandingPageFreeTrial } from './free-trial'
import { LandingHeader } from './Header'
import { LandingAbout } from './About'
import { LandingScrollTopButton } from './Shared/ScrollTopButton'

export const ThemeLandingPage = ({ className = '', style = {} }) => {
  useEffect(() => {
    AOS.init({ duration: 2000 })
  }, [])

  return (
    <div className={`landing-page ${className}`} style={style}>
      <div className="landing-page__wrapper">
        <LandingHeader />
        <LandingAbout />
        <LandingFeatures />
        <LandingPageFreeTrial/>
        <LandingPageContact />
        <LandingFooter />
        <LandingScrollTopButton />
      </div>
    </div>
  )
}
