import useTranslation from 'hooks/useTranslation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DefaultPropsType } from '../../../interfaces/types'
import { MapGoolge } from '../map'

type FormData = {
  textPlaceholder: string
}

export const LandingPageContact = ({
  className = '',
  style,
}: DefaultPropsType) => {
  const router = useRouter()
  const { t, locale } = useTranslation()

  const [name, setName] = useState({
    name: 'myname',
    value: '',
    isError: false,
    errorMessage: t('name-validate'),
  })

  const [phone, setPhone] = useState({
    name: 'myphone',
    value: '',
    isError: false,
    errorMessage: t('phone-validate'),
  })

  const [email, setEmail] = useState({
    name: 'email',
    value: '',
    isError: false,
    errorMessage: t('email-validate'),
  })

  const [isPopup, setPopup] = useState(false)

  const handleClose = () => {
    setPopup(false)
  }

  const handleChange = (event: any) => {
    //To stop default events
    event.persist()

    const inputValue = event.target.value

    console.log(
      event.target.name,
      /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
        inputValue,
      ),
    )

    switch (event.target.name) {
      case 'myname':
        if (/[A-Za-z_]\\w{1,29}$/.test(inputValue))
          setName({ ...name, value: inputValue, isError: true })
        else setName({ ...name, value: inputValue, isError: false })
        break

      case 'myphone':
        if (
          /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
            inputValue,
          )
        )
          setPhone({ ...phone, value: inputValue, isError: false })
        else setPhone({ ...phone, value: inputValue, isError: true })
        break

      case 'email':
        console.log(inputValue)
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputValue))
          setEmail({ ...email, value: inputValue, isError: false })
        else setEmail({ ...email, value: inputValue, isError: true })
        break

      default:
        break
    }
  }
  // console.log(phone)

  const submit = () => {
    let check = true

    if (!name.value || name.isError) {
      setName({ ...name, isError: true })
      check = false
    }

    if (!phone.value || phone.isError) {
      setPhone({ ...phone, isError: true })
      check = false
    }

    if (!email.value || email.isError) {
      setEmail({ ...email, isError: true })
      check = false
    }
    if (check) setPopup(true)
  }
  const [scrollHere, setScrollHere] = useState(false)

  const handleScroll = (e: any) => {
    const elementID = document.getElementById('contact')

    if (elementID) {
      if (window.scrollY + window.innerHeight / 2 > elementID.offsetTop) {
        setScrollHere(true)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setName({ ...name, errorMessage: t('name-validate') })
    setPhone({ ...phone, errorMessage: t('phone-validate') })
    setEmail({ ...email, errorMessage: t('email-validate') })
  }, [router.locale])

  const [textPlaceholder, setPlaceholder] = useState(t('email-validate'))

  useEffect(() => {
    setPlaceholder(t('email-validate'))
  }, [t])

  return (
    <div
      id="contact"
      className={`l-landing-page-contact ${className}`}
      style={style}
    >
      <div className="landing-wrapper">
        <div className=" l-landing-page-contact__box">
          <div
            className={`l-landing-page-contact__form ${
              scrollHere ? 'l-landing-page-contact-animation' : ''
            }`}
          >
            <div className="l-landing-page-contact__title">
              <p>{t('contact-title')}</p>
            </div>
            <div className="l-landing-page-contact__form-input">
              <div className="l-landing-page-contact__input-style">
                <div className="floating-form">
                  <input
                    name="myname"
                    type="text"
                    className={'form-control' + (name.isError ? ' error' : '')}
                    id="name"
                    autoComplete="off"
                    required
                    value={name.value}
                    onChange={handleChange}
                  />
                  <label htmlFor="name">{t('your-name')}</label>
                  {name.isError && (
                    <span className="l-landing-page-contact__error-message">
                      <img
                        src="/images/landingpage/warning.png"
                        alt="warning"
                      />
                      {name.errorMessage}
                    </span>
                  )}
                </div>
              </div>
              <div className="l-landing-page-contact__input-style">
                <div className="floating-form">
                  <input
                    name="myphone"
                    type="tel"
                    className={'form-control' + (name.isError ? ' error' : '')}
                    id="phone"
                    autoComplete="off"
                    required
                    value={phone.value}
                    onChange={handleChange}
                  />
                  <label htmlFor="phone">{t('phone')}</label>

                  {phone.isError && (
                    <span className="l-landing-page-contact__error-message">
                      <img
                        src="/images/landingpage/warning.png"
                        alt="warning"
                      />
                      {phone.errorMessage}
                    </span>
                  )}
                </div>
              </div>
              <div className="l-landing-page-contact__input-style">
                <div className="floating-form ">
                  <input
                    name="email"
                    type="email"
                    className={
                      'form-control' +
                      (email.value ? ' active' : '') +
                      (name.isError ? ' error' : '')
                    }
                    id="email"
                    autoComplete="off"
                    required
                    value={email.value}
                    onChange={handleChange}
                    // onFocus={() => setPlaceholder('')}
                    // onBlur={() =>
                    //   setPlaceholder(email.value ? '' : t('email-validate'))
                    // }
                  />
                  <label htmlFor="email">{t('email')}</label>

                  {email.isError && (
                    <span className="l-landing-page-contact__error-message">
                      <img
                        src="/images/landingpage/warning.png"
                        alt="warning"
                      />
                      {email.errorMessage}
                    </span>
                  )}
                </div>
              </div>
              <div
                className="l-landing-page-contact__input-style"
                style={{ marginBottom: 0 }}
              >
                <div className="floating-form">
                  <textarea
                    className="form-control"
                    rows={8}
                    id="message"
                    autoComplete="off"
                    required
                    defaultValue={''}
                  />
                  <label htmlFor="message">{t('questions')}</label>
                </div>
              </div>
              <div
                className="l-landing-page-contact__form-input"
                style={{ marginTop: 0 }}
              >
                <button
                  className="l-landing-page-contact__button-style  subscription submit-email"
                  onClick={submit}
                >
                  {t('submit')}
                </button>
              </div>
            </div>
          </div>
          {isPopup && (
            <div className="l-landing-page-contact__popup">
              <div className="l-landing-page-contact__popup-style">
                <div
                  className="l-landing-page-contact__popup-icon-close"
                  onClick={handleClose}
                >
                  <img
                    src="/images/landingpage/icon-close-popup.png"
                    alt="img popup"
                  />
                </div>
                <div className="l-landing-page-contact__popup-img">
                  <img
                    src="/images/landingpage/img-popup.png"
                    alt="img popup"
                  />
                </div>

                <div className={`l-landing-page-contact__popup-text ${router.locale === 'en' ? 'offset-popup-text' : ''}`}>
                  <p className="l-landing-page-contact__popup-title">
                    {t('feedback-message')}
                  </p>
                  <span className="l-landing-page-contact__popup-description">
                    {t('feedback-title')}
                  </span>
                  <div className="l-landing-page-contact__popup-button">
                    <button onClick={handleClose}>OK</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={`l-landing-page-contact__map-goolge ${
              scrollHere ? 'l-landing-page-contact-animation-map' : ''
            }`}
          >
            <MapGoolge />
          </div>
        </div>
      </div>
    </div>
  )
}
