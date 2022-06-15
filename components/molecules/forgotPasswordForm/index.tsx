import { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import OtpInput from 'react-otp-input'
import { Button, Tooltip } from 'rsuite'

import { paths } from 'api/paths'
import { validateEmail } from 'api/utils'
import { LoginContext } from 'interfaces/contexts'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { InputPassword } from 'components/atoms/inputPassword'
import { InputCustom } from 'components/atoms/inputCustom'

const FORGOT_STEP = {
  INPUT_MAIL: 'input mail',
  OTP: 'otp',
  NEW_PASSWORD: 'new password',
  CHANGE_SUCCESS: 'change success',
}

export const ForgotPasswordForm = () => {
  const { csrfToken } = useContext(LoginContext)

  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [step, setStep] = useState(FORGOT_STEP.INPUT_MAIL)
  const [OTP, setOTP] = useState('')
  const [isPasswordType, setIsPassWordType] = useState(true)
  const [isRePasswordType, setIsRePassWordType] = useState(true)

  const [newPassword, setNewPassWord] = useState('')
  const [hintPass, setHintPass] = useState([false, false, false])
  const [confirmPass, setConfirmPass] = useState('')
  const [isConfirmEqual, setIsConfirmEqual] = useState(false)

  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (step === FORGOT_STEP.OTP) {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(myInterval)
            console.log('Expired-Time!!!!')
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        }
      }
    }, 1000)
    return () => {
      clearInterval(myInterval)
    }
  }, [step, minutes, seconds])

  useEffect(() => {
    const el = document.getElementById('mail-input')
    el && el.focus()
  }, [])

  const togglePassword = () => {
    setIsPassWordType(!isPasswordType)
  }

  const toggleRePassword = () => {
    setIsRePassWordType(!isRePasswordType)
  }

  const onChangNewPassword = (value: any) => {
    const newValue = value.trim()
    setError(null)
    if (!newValue) {
      setHintPass([false, false, false])
    } else {
      const newHints = [...hintPass]
      newHints[0] = newValue.length >= 8
      newHints[1] =
        hasNumber(newValue) &&
        (hasLowerCase(newValue) || hasUpperCase(newValue))
      newHints[2] = hasUpperCase(newValue)
      setHintPass(newHints)
    }
    setNewPassWord(newValue)
    setIsConfirmEqual(newValue === confirmPass)
  }

  function hasLowerCase(str: string) {
    const regex = new RegExp('(?=.*[a-z])')
    return regex.test(str)
  }

  function hasUpperCase(str: string) {
    const regex = new RegExp('(?=.*[A-Z])')
    return regex.test(str)
  }

  function hasNumber(str: string) {
    return /\d/.test(str)
  }

  const onContinue = async (newStep: string) => {
    if (step === FORGOT_STEP.INPUT_MAIL) {
      const validEmail = validateEmail(email)
      if (!validEmail) {
        setError('Định dạng email không đúng!')
        return
      } else {
        const res = await fetch(paths.api_users_user_exist, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_name: email }),
        })
        const json = await res.json()
        if (json.isExist) {
          setError(null)
          setStep(newStep)
          const isSuccess = makeOtp()
          if (!isSuccess) {
            setError('Đã xảy ra lỗi.')
          }
        } else {
          setError('Email chưa đăng ký sử dụng.')
        }
      }
    } else if (step === FORGOT_STEP.NEW_PASSWORD) {
      const hintIncorrect = hintPass.some((hint) => !hint)
      if (hintIncorrect) {
        setError('Mật khẩu không hợp lệ')
      } else if (!isConfirmEqual) {
        setError('Không trùng khớp với mật khẩu')
      } else {
        const formData = {
          password: newPassword.trim(),
          user_name: email.trim(),
        }
        console.log('formData===', formData)
        const res = await fetch(paths.api_users_forgot_password, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        const json = await res.json()
        console.log('ChangePasss===', res, json)
        if (json.error || !res.ok) {
          setError(json?.message || 'Email hoặc Mật khẩu không đúng!')
          return
        } else {
          setStep(newStep)
        }
      }
    }
  }

  const onChangConfirmPassword = (value: string) => {
    const newValue = value.trim()
    setError(null)
    setConfirmPass(newValue)
    setIsConfirmEqual(newValue ? newValue === newPassword : false)
  }

  const onChangeOTP = async (otp: any) => {
    setOTP(otp)
    if (otp.length === 6) {
      const res = await fetch(paths.api_users_otp, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: email.trim(),
          otp_code: otp,
        }),
      })
      const json = await res.json()
      if (json.error || !res.ok) {
        setError(json?.message || 'Mã OTP không đúng.')
        return
      } else {
        setStep(FORGOT_STEP.NEW_PASSWORD)
        setTimeout(() => {
          const el = document.getElementById('new-password')
          el && el.focus()
        }, 0)
      }
    } else {
      setError(null)
    }
  }

  const reSendOtp = async () => {
    if (minutes === 0 && seconds === 0) {
      const isSuccess = makeOtp()
      if (!isSuccess) {
        setError('Không thể gửi lại mã.')
      } else {
        setOTP('')
        setMinutes(5)
      }
    }
  }

  async function makeOtp() {
    const res = await fetch(paths.api_users_otp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_name: email.trim() }),
    })
    const json = await res.json()
    if (json.error || !res.ok) {
      return false
    } else {
      return true
    }
  }

  function renderInputMail() {
    return (
      <div className={`m-login-form`}>
        <p className="m-login-form__title">Quên mật khẩu</p>
        <p className="m-login-form__description">
          Vui lòng nhập thông tin email bạn đã dùng để đăng ký tài khoản tại
          Test Bank
        </p>
        <form
          className="m-login-form__container m-login-form__forgot"
          onSubmit={(e: any) => {
            e.preventDefault()
            onContinue(FORGOT_STEP.OTP)
          }}
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="form-row">
            <InputCustom
              className="info-input"
              label="Email"
              type="text"
              onChange={(val) => {
                setError(null)
                setEmail(val.trim())
              }}
              autoFocus={true}
              isError={error}
            />
          </div>
          {error && (
            <div className="error-contain error-email-forgot">
              <img
                className="warning-img"
                src="/images/authen/warning.png"
                alt="warning"
              />
              <span className={'form-error-message'}>{error} </span>
            </div>
          )}
          <div className="form-row submit-group">
            <Button
              className="submit-btn"
              size="lg"
              onClick={() => onContinue(FORGOT_STEP.OTP)}
            >
              Tiếp tục
            </Button>
          </div>
        </form>
      </div>
    )
  }

  function renderOTP() {
    return (
      <div className={`m-login-form`}>
        <div className="m-login-form__container">
          <p className="m-login-form__title">Quên mật khẩu</p>
          <p className="m-login-form__forgot-email-des">
            Chúng tôi đã gửi mã xác nhận đến email
          </p>
          <p className="m-login-form__forgot-email">{email.trim()}</p>
          <OtpInput
            value={OTP}
            onChange={(otp: any) => onChangeOTP(otp)}
            numInputs={6}
            inputStyle={{
              width: '5.3rem',
              height: '4.8rem',
              margin: '0 0.8rem 0 0',
              fontSize: '2.4rem',
              borderRadius: 8,
              border: '1px solid #D5DEE8',
              fontWeight: '600',
            }}
            focusStyle={{
              border: '1px solid #6868AC',
            }}
            shouldAutoFocus
          />
          {error && (
            <div className="error-contain">
              <img
                className="warning-img"
                src="/images/authen/warning.png"
                alt="warning"
              />
              <span className={'form-error-message'}>{error} </span>
            </div>
          )}
          <p className="m-login-form__opt-des">
            {minutes === 0 && seconds === 0 ? (
              <span> Mã OTP đã hết hạn</span>
            ) : (
              <p>
                Mã OTP sẽ hết hạn sau
                <span className="otp-time">
                  {' '}
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </p>
            )}
          </p>
          <p
            className={`m-login-form__${
              minutes === 0 && seconds === 0
                ? 'resend-otp-active'
                : 'resend-otp'
            }`}
            onClick={reSendOtp}
          >
            Gửi lại mã OTP
          </p>
        </div>
      </div>
    )
  }

  function renderNewPassword() {
    return (
      <div className={`m-login-form`}>
        <p className="m-login-form__title">Đặt lại mật khẩu</p>
        <div className="m-login-form__avatar">
          <img
            className="avatar-img"
            src="/images/collections/clt-sample-avatar.png"
            alt="avatar"
          />
          <p className="avatar-email">{email.trim()}</p>
        </div>
        <form className="m-login-form__container">
          <div className="form-row">
            <div className="contai-pass">
              <InputPassword
                className="info-input"
                label="Mật khẩu"
                type={isPasswordType ? 'password' : 'text'}
                onChange={(val) => onChangNewPassword(val)}
                isError={error}
                placeholder="Mật khẩu mới"
                speaker={speaker}
              />
              <img
                className="eye-icon"
                src="/images/authen/show-password.png"
                alt="eye"
                onClick={togglePassword}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="contai-pass">
              <InputPassword
                className="info-input"
                label="Mật khẩu"
                type={isRePasswordType ? 'password' : 'text'}
                onChange={(val) => onChangConfirmPassword(val)}
                isError={error}
                speaker={confirmPassHint}
                placeholder="Xác nhận mật khẩu"
              />
              <img
                className="eye-icon"
                src="/images/authen/show-password.png"
                alt="eye"
                onClick={toggleRePassword}
              />
            </div>
          </div>
          {error && (
            <div className="error-contain">
              <img
                className="warning-img"
                src="/images/authen/warning.png"
                alt="warning"
              />
              <span className={'form-error-message'}>{error} </span>
            </div>
          )}
          <div className="form-row submit-group">
            <Button
              className="submit-btn"
              size="lg"
              onClick={() => onContinue(FORGOT_STEP.CHANGE_SUCCESS)}
            >
              Tiếp tục
            </Button>
          </div>
        </form>
      </div>
    )
  }

  function renderSuccess() {
    return (
      <div className={`m-login-form`}>
        <div className="m-login-form__success">
          <img
            className="success-img"
            src="/images/authen/check-circle.png"
            alt="success"
          />
        </div>
        <p className="m-login-form__title">Mật khẩu của bạn đã được thay đổi</p>
        <p className="m-login-form__forgot-email-des">
          Đổi mật khẩu thành công, vui lòng đăng nhập lại
        </p>
        <form className="m-login-form__container">
          <div className="form-row submit-group return-btn">
            <Button
              className="submit-btn"
              size="lg"
              onClick={() => router.replace('/login')}
            >
              Về trang đăng nhập
            </Button>
          </div>
        </form>
      </div>
    )
  }

  const speaker = (
    <Tooltip
      style={{
        width: 170,
        paddingBottom: 16,
        marginTop: 16,
        backgroundColor: '#ffffff',
      }}
    >
      <div className="m-login-form__check-pass">
        <img
          className={'check-img'}
          src={
            hintPass[0]
              ? '/images/authen/check-circle.png'
              : '/images/authen/check-circle-grey.png'
          }
          alt="check-pass"
        />
        <p className={hintPass[0] ? 'hint-pass-correct' : 'hint-pass'}>
          Có ít nhất 8 ký tự
        </p>
      </div>
      <div className="m-login-form__check-pass">
        <img
          className="check-img"
          src={
            hintPass[1]
              ? '/images/authen/check-circle.png'
              : '/images/authen/check-circle-grey.png'
          }
          alt="check-pass"
        />
        <p className={hintPass[1] ? 'hint-pass-correct' : 'hint-pass'}>
          Bao gồm chữ và số
        </p>
      </div>
      <div className="m-login-form__check-pass">
        <img
          className="check-img"
          src={
            hintPass[2]
              ? '/images/authen/check-circle.png'
              : '/images/authen/check-circle-grey.png'
          }
          alt="check-pass"
        />
        <p className={hintPass[2] ? 'hint-pass-correct' : 'hint-pass'}>
          Có ký tự viết hoa
        </p>
      </div>
    </Tooltip>
  )

  const confirmPassHint = (
    <Tooltip
      style={{
        width: 170,
        paddingBottom: 16,
        marginTop: 16,
        backgroundColor: '#ffffff',
      }}
    >
      <div className="m-login-form__check-pass">
        <img
          className={'check-img'}
          src={
            isConfirmEqual
              ? '/images/authen/check-circle.png'
              : '/images/authen/check-circle-grey.png'
          }
          alt="check-pass"
        />
        <p className={isConfirmEqual ? 'hint-pass-correct' : 'hint-pass'}>
          {isConfirmEqual ? 'Trùng khớp' : 'Không trùng khớp'}
        </p>
      </div>
    </Tooltip>
  )

  return (
    <div className="forgot-pass">
      {step === FORGOT_STEP.INPUT_MAIL && renderInputMail()}
      {step === FORGOT_STEP.OTP && renderOTP()}
      {step === FORGOT_STEP.NEW_PASSWORD && renderNewPassword()}
      {step === FORGOT_STEP.CHANGE_SUCCESS && renderSuccess()}
    </div>
  )
}
