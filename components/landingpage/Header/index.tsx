import Link from 'next/link'
import { LandingButton } from '../Shared/Button'
import { LandingNav } from '../Navigation'
import { LandingDropdown } from '../Shared/Dropdown'
import { DefaultPropsType } from 'interfaces/types'
import { useEffect, useState } from 'react'
import { LandingMenuIcon } from '../Shared/MenuIcon'
import useTranslation from 'hooks/useTranslation'


export const LandingHeader = ({
  className = '',
  style = {},
}: DefaultPropsType) => {
  const {t} = useTranslation()
  const [sticky, setSticky] = useState('')

  const handleScroll = (e: any) => {
    if (window.scrollY >= 100) setSticky('sticky');
    else setSticky('');
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const ScrollToSectionHandle = (section: string) => {
    window.scrollTo({
      top: document.getElementById(section).offsetTop -95,
      behavior: 'smooth',
    })
  }

  const handleMenuIconClick = (toggle: any) => {
    if (toggle) document.getElementById('landing-header').classList.add("mobile-menu-visible")
    else document.getElementById('landing-header').classList.remove("mobile-menu-visible")
    toggle ? disable() : enable()
    var myDiv = document.getElementById('landing-header');
    myDiv.scrollTop = 0;
  }

  function disable() {
    document.body.classList.add("stop-scrolling");
  }
    
  function enable() {
    document.body.classList.remove("stop-scrolling")
    var myDiv = document.getElementById('landing-header');
    myDiv.scrollTop = 0;
  }

  return (
    <div
      id="landing-header"
      className={`landing-header ${sticky} ${className}`}
      style={style}
    >
      <div className="landing-header__wrapper landing-wrapper">
        <div className="landing-header__wrapper__header">
          <img className="landing-header__logo" src="/images/landingpage/logo-mobile.png" alt="logo" />
          <LandingMenuIcon className="landing-header__wrapper__header__menu-icon" onClick={handleMenuIconClick}/>
        </div>
        <div className="landing-header__wrapper__left">
          <LandingNav className="landing-header__nav" />
        </div>
        <div className="landing-header__wrapper__right">
          <LandingDropdown />
          <LandingButton className="login-btn" >
            <Link href="/login">
              <a className="__link">{t('sign-in-menu')}</a>
            </Link>
          </LandingButton>
          <LandingButton
            className='trial-btn'
            style={{ background: '#35B9E5', color: '#FFFFFF' }}
            onClick={() => ScrollToSectionHandle('free-trial')}
          >
            {t('free-trial-menu')}
          </LandingButton>
        </div>
      </div>
    </div>
  )
}
