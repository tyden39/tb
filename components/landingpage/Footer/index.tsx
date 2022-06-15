import useTranslation from 'hooks/useTranslation'
import { DefaultPropsType } from 'interfaces/types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const LandingFooter = ({ className = '', style }: DefaultPropsType) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [email, setEmail] = useState({ value: '', error: '' })

  const [textPlaceholder, setPlaceholder] = useState(t('enter-email-freetrial'))

  useEffect(() => {
    setPlaceholder(t('enter-email-freetrial'))
  }, [t])

  return (
    <footer className={`l-landing-footer ${className} `}>
      <div className="l-landing-footer__icon-dtp landing-wrapper">
        <img src="/images/landingpage/logo-dtp.png" alt="" />
      </div>
      <div className="l-landing-footer__side landing-wrapper">
        <div className="l-landing-footer__left-side">
          <p className="l-landing-footer__title-company">{t('company-name')}</p>
          <div className="l-landing-footer__contact">
            <span className="l-landing-footer__icon-location">
              <img src="/images/landingpage/ic-location.png" alt="location" />
            </span>
            <span className="l-landing-footer__address">
              {t('company-address')}
            </span>
          </div>
          <div className="l-landing-footer__contact">
            <span className="l-landing-footer__icon">
              <img src="/images/landingpage/ic-phone.png" alt="phone" />
            </span>
            <span className="l-landing-footer__address">
              <a href="tel:+842838456936">{t('company-phone')}</a>
            </span>
          </div>
          <div className="l-landing-footer__contact">
            <span className="l-landing-footer__icon">
              <img src="/images/landingpage/ic-email.png" alt="email" />
            </span>
            <span className="l-landing-footer__address">
              <a href="mailto:someone@yoursite.com">{t('company-email')}</a>
            </span>
          </div>
        </div>
        <div className="l-landing-footer__right-side">
          <div className="l-landing-footer__form-input">
            <span className="l-landing-footer__form-title">
              {t('discover')}
            </span>
            <form className="l-landing-footer__subscription">
              <input
                className="l-landing-footer__input-email"
                type="email"
                placeholder={textPlaceholder}
                onFocus={() => setPlaceholder('')}
                onBlur={() =>
                  setPlaceholder(email.value ? '' : t('enter-email-freetrial'))
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
                className="l-landing-footer__submit-email"
                type="button"
                onClick={() => {
                  email.value &&
                    !email.error &&
                    router.push(`/register?email=${email.value}`)
                  !email.value && setEmail((s) => ({ ...s, error: 'empty' }))
                }}
              >
                <span className="l-landing-footer__before-submit">
                  {t('try-it')}
                </span>
              </button>
            </form>
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
          <div className="l-landing-footer__social">
            <p style={{ marginRight: '4rem' }}>{t('connect-with-us')}</p>
            <img
              style={{ marginRight: '2.4rem' }}
              src="/images/landingpage/ic-fb.png"
              alt="facebook"
              className="facebook"
            />
            <img
              src="/images/landingpage/ic-yt.png"
              alt="youtube"
              className="youtube"
            />
          </div>
        </div>
      </div>
      <div className="l-landing-footer__copyright">
        <span>
          Copyright (c) EDUCATION SOLUTIONS VIET NAM.,LTD. All Rights Reserved
        </span>
      </div>
    </footer>
  )
}
