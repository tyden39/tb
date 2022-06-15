import useTranslation from 'hooks/useTranslation'
import { DefaultPropsType } from 'interfaces/types'

const ScrollToSectionHandle = (section: string) => {
  document.getElementById('landing-header').classList.remove("mobile-menu-visible")
  document.getElementsByClassName('landing-menu-icon')[0].classList.remove('active')

  let height = 0;
  let sectionHeight = document.getElementById(section).offsetTop;
  switch (section) {
    case 'about':
      height = sectionHeight - 110
      break;
    case 'features':
      if (window.innerWidth <= 768) height = sectionHeight - 54*2// mobile
      if (window.innerWidth <= 1199) height = sectionHeight - 96*2 + 32// tablet
      else height = sectionHeight - 96*2// desktop

      break;
    case 'contact':
      if (window.innerWidth <= 768) height = sectionHeight - 60 // mobile
      if (window.innerWidth <= 1199) height = sectionHeight - 95 + 32 // tablet
      else height = sectionHeight - 95 // desktop
      break;
  
    default:
      break;
  }

  window.scrollTo({
    top: height,
    behavior: 'smooth',
  })

  document.body.classList.remove("stop-scrolling")
  var myDiv = document.getElementById('landing-header');
  myDiv.scrollTop = 0;
}

export const LandingNav = ({ className = '', style }: DefaultPropsType) => {
  const { t } = useTranslation()

  return (
    <div className={`landing-nav ${className}`} style={style}>
      <div className="landing-nav__menu ">
        <div
          className="landing-nav__menu__item"
          onClick={() => ScrollToSectionHandle('about')}
        >
          {t('about-us-menu')}
        </div>
        <div
          className="landing-nav__menu__item"
          onClick={() => ScrollToSectionHandle('features')}
        >
          {t('why-test-bank-menu')}
        </div>
        <div
          className="landing-nav__menu__item"
          onClick={() => ScrollToSectionHandle('contact')}
        >
          {t('contact-us-menu')}
        </div>
      </div>
    </div>
  )
}
