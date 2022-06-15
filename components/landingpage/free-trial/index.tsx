import useTranslation from 'hooks/useTranslation'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { DefaultPropsType } from '../../../interfaces/types'
import { LandingPageDescription } from '../description'

type FormData = {
  textPlaceholder: string
}

export const LandingPageFreeTrial = ({
  className = '',
  style,
}: DefaultPropsType) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [email, setEmail] = useState({ value: '', error: '' })

  const [textPlaceholder, setPlaceholder] = useState(t('enter-email-freetrial'))
  const [scrollHere, setScrollHere] = useState(false)

  const handleScroll = (e: any) => {
    const freetrial = document.getElementById('free-trial')

    if (freetrial){
      if (window.scrollY  + window.innerHeight/2 > freetrial.offsetTop) {
        setScrollHere(true);
      }
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  },[])

  useEffect(() => {
    setPlaceholder(t('enter-email-freetrial'))
  }, [t])

  return (
    <div
      id="free-trial"
      className={`l-landing-page-free-trial ${className}`}
      style={style}
    >
      <div className="l-landing-page-free-trial__image">
        <img
          src="/images/landingpage/img-free-trial.png"
          alt=""
          data-aos="aos"
        />
      </div>
      <div className="landing-wrapper flex-free-trial">
        <div className="l-landing-page-free-trial__section">
          <div className="l-landing-page-free-trial__form">
            <div className="l-landing-page-free-trial__description">
              <LandingPageDescription className={`${scrollHere ? 'l-landing-page-description-animation' : ''}`} />
            </div>
            <div
              className={`l-landing-page-free-trial__form-input ${scrollHere ? 'free-trial-animation' : ''}`}
              
            >
              <div className="l-landing-page-free-trial__content">
                <div className="subscription">
                  <input
                    className="add-email"
                    placeholder={textPlaceholder}
                    onFocus={() => setPlaceholder('')}
                    onBlur={() =>
                      setPlaceholder(
                        email.value ? '' : t('enter-email-freetrial'),
                      )
                    }
                    onChange={(e) =>
                      setEmail({
                        value: e.target.value,
                        error:
                          e.target.value &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)
                            ? 'format'
                            : '',
                      })
                    }
                    onKeyPress={null}
                  />
                  <button
                    className="submit-email"
                    type="button"
                    // style={{ opacity: email.error ? '0.8' : 1 }}
                    // disabled={!email.value}
                    onClick={() => {
                      email.value &&
                        !email.error &&
                        router.push(`/register?email=${email.value}`)
                      !email.value &&
                        setEmail((s) => ({ ...s, error: 'empty' }))
                    }}
                  >
                    <span className="before-submit">
                      <img
                        src="/images/landingpage/icon-sent-free-trial.png"
                        alt=""
                      />
                    </span>
                  </button>
                </div>
                <div
                  className="message-validate"
                  style={{ opacity: email.error ? 1 : 0 }}
                >
                  <img src="/images/landingpage/warning.png" alt="warning" />{' '}
                  {t(
                    email.error === 'format'
                      ? 'email-validate'
                      : 'email-required'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
