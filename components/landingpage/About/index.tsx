import useTranslation from 'hooks/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LandingButton } from '../Shared/Button'

export const LandingAbout = ({ className = '', style = {} }) => {
  const {t} = useTranslation()
  const router = useRouter()

  return (
    <div id="about" className={`landing-about  ${className}`} style={style}>
      <div className="landing-wrapper">
        <div className="landing-about__content">
          <p className="landing-about__content__title">
            {t('about-title-a')}
            <span className="landing-highlight">
              <img src={`/images/landingpage/tests-${router.locale}.png`} alt="pencil" />
            </span>{' '}
          </p>
          <p className="landing-about__content__title">{t('about-title-c')}</p>
          <p className="landing-about__content__description">
            {t('about-description')}
          </p>
          <LandingButton className="landing-about__content__button">
            <Link href="/register">
              <a style={{ color: 'white' }}>{t('register-now')}</a>
            </Link>
          </LandingButton>
        </div>
      </div>
    </div>
  )
}
