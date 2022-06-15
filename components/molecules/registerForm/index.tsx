import { useContext, useEffect, useState } from 'react'

import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import OtpInput from 'react-otp-input'
import { Button, Checkbox, Whisper, Tooltip } from 'rsuite'

import { paths } from 'api/paths'
import { validateEmail } from 'api/utils'
import { USER_ROLES } from 'interfaces/constants'
import { LoginContext } from 'interfaces/contexts'
import { OPT_TIME_MINUTES } from 'utils/constant'
import { useWindowSize } from 'utils/hook'

import { DefaultPropsType } from '../../../interfaces/types'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { InputPassword } from 'components/atoms/inputPassword'
import { InputCustom } from 'components/atoms/inputCustom'

type FormData = {
  email: string
  password: string
  rePassword: string
}

const REGISTER_STEP = {
  INPUT_MAIL: 'input mail',
  OTP: 'otp',
  REGISTER_SUCCESS: 'register success',
}

export const RegisterForm = ({ className = '', style }: DefaultPropsType) => {
  const router = useRouter()
  console.log(router.query)

  const { csrfToken } = useContext(LoginContext)
  const [email, setEmail] = useState(router.query?.email || '')
  const [errorEmail, setErrorEmail] = useState(null)
  const [errorPass, setErrorPass] = useState(null)
  const [errorPolicy, setErrorPolicy] = useState(null)
  const [isPasswordType, setIsPassWordType] = useState(true)
  const [isRePasswordType, setIsRePassWordType] = useState(true)
  const [hintPass, setHintPass] = useState([false, false, false])
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [acceptPolicy, setAcceptPolicy] = useState(true)

  const [isConfirmEqual, setIsConfirmEqual] = useState(false)
  const [step, setStep] = useState(REGISTER_STEP.INPUT_MAIL)
  const [OTP, setOTP] = useState('')
  const [minutes, setMinutes] = useState(OPT_TIME_MINUTES)
  const [seconds, setSeconds] = useState(0)
  const [errorOtp, setErrorOtp] = useState(null)

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (step === REGISTER_STEP.OTP) {
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

  const onSubmit = async () => {
    const validEmail = validateEmail(email)
    console.log('Email====', email)
    if (!validEmail) {
      setErrorEmail('Định dạng email không đúng!')
    } else {
      setErrorEmail(null)
      // const validPass = validatePass();
      const hintIncorrect = hintPass.some((hint) => !hint)
      if (hintIncorrect) {
        setErrorPass('Mật khẩu không hợp lệ')
      } else if (!isConfirmEqual) {
        setErrorPass('Không trùng khớp với mật khẩu')
      } else {
        if (!acceptPolicy) {
          setErrorPolicy('Vui lòng đồng ý với điều khoản và chính sách bảo mật')
        } else {
          setErrorPass(null)
          const res = await fetch(paths.api_users_user_exist, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_name: email }),
          })
          const json = await res.json()
          if (json.isExist) {
            setErrorEmail('Email đã được đăng ký trên hệ thống')
            return
          } else {
            setStep(REGISTER_STEP.OTP)
            const isSuccess = makeOtp()
            if (!isSuccess) {
              setErrorOtp('Đã xảy ra lỗi.')
            }
          }
        }
      }
    }
  }

  const onLoginSocial = (type: string) => {
    signIn(type)
  }

  const togglePassword = () => {
    setIsPassWordType(!isPasswordType)
  }

  const toggleRePassword = () => {
    setIsRePassWordType(!isRePasswordType)
  }

  const onChangNewPassword = (value: string) => {
    const newValue = value.trim()
    setErrorPass(null)
    setNewPass(newValue)
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
    setIsConfirmEqual(newValue === confirmPass)
  }

  const onChangConfirmPassword = (value: string) => {
    const newValue = value.trim()
    setErrorPass(null)
    setConfirmPass(newValue)
    setIsConfirmEqual(newValue ? newValue === newPass : false)
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

  const onChangeOTP = async (otp: any) => {
    setOTP(otp)
    if (otp.length === 6) {
      const res = await fetch(paths.api_users_otp, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: (email as String).trim(),
          otp_code: otp,
        }),
      })
      const json = await res.json()
      if (json.error || !res.ok) {
        setErrorOtp(json?.message || 'Mã OTP không đúng.')
      } else {
        const formData = {
          user_name: email,
          email: email,
          password: newPass.trim(),
          user_role_id: USER_ROLES.Teacher,
        }
        const res = await fetch(paths.api_users_register, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        const json = await res.json()
        if (json.error || !res.ok) {
          setErrorPass(json?.message || 'Email hoặc Mật khẩu không đúng!')
          return
        } else {
          setStep(REGISTER_STEP.REGISTER_SUCCESS)
        }
      }
    } else {
      setErrorOtp(null)
    }
  }

  const reSendOtp = () => {
    if (minutes === 0 && seconds === 0) {
      const isSuccess = makeOtp()
      if (!isSuccess) {
        setErrorOtp('Không thể gửi lại mã.')
      } else {
        setErrorOtp(null);
        setOTP('');
        setMinutes(OPT_TIME_MINUTES);
      }
    }
  }

  async function makeOtp() {
    const res = await fetch(paths.api_users_otp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_name: (email as String).trim() }),
    })
    const json = await res.json()
    if (json.error || !res.ok) {
      return false
    } else {
      return true
    }
  }

  const passwordHint = (
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

  function renderInputMail() {
    return (
      <div className={`m-login-form ${className}`} style={style}>
        <p className="m-login-form__title">Tạo tài khoản mới</p>
        <form
          className="m-login-form__container"
          // onSubmit={handleSubmit(onSubmit)}
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="form-row">
            <InputCustom
              className="info-input"
              label="Email"
              type="text"
              defaultValue={email ? email : ''}
              onChange={(val) => {
                setErrorEmail(null)
                setEmail(val.trim())
              }}
              autoFocus={true}
              isError={errorEmail}
            />
            {errorEmail && (
              <div className="error-contain">
                <img className="warning-img" src="/images/authen/warning.png" />
                <span className={'form-error-message'}>{errorEmail} </span>
              </div>
            )}
          </div>
          <div className="form-row">
            <div className="contai-pass">
              {/* <Whisper
                controlId="control-id-container"
                preventOverflow
                trigger="focus"
                speaker={passwordHint}
                placement={width > 1024 ? 'leftStart' : 'topStart'}
              >
                <input
                  className={`rs-input rs-input-lg form-input input-pass ${
                    errorPass ? 'error-input' : ''
                  }`}
                  placeholder="Nhập mật khẩu mới"
                  type={isPasswordType ? 'password' : 'text'}
                  {...register('password')}
                  onChange={(e) => onChangNewPassword(e.target.value)}
                />
              </Whisper> */}
              <InputPassword
                className="info-input"
                label="Mật khẩu"
                type={isPasswordType ? 'password' : 'text'}
                onChange={(val) => onChangNewPassword(val)}
                isError={errorPass}
                speaker={passwordHint}
              />
              <img
                className="eye-icon"
                src="/images/authen/show-password.png"
                onClick={togglePassword}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="contai-pass">
              {/* <Whisper
                controlId="control-id-container"
                preventOverflow
                trigger="focus"
                speaker={confirmPassHint}
                placement={width > 1024 ? 'leftStart' : 'topStart'}
              >
                <input
                  className={`rs-input rs-input-lg form-input input-pass ${
                    errorPass ? 'error-input' : ''
                  }`}
                  placeholder="Nhập lại mật khẩu "
                  type={isRePasswordType ? 'password' : 'text'}
                  {...register('rePassword')}
                  onChange={(e) => onChangConfirmPassword(e.target.value)}
                  onFocus={() =>
                    setIsConfirmEqual(
                      confirmPass ? newPass === confirmPass : false,
                    )
                  }
                />
              </Whisper> */}
              <InputPassword
                className="info-input"
                label="Xác nhận mật khẩu"
                type={isRePasswordType ? 'password' : 'text'}
                onChange={(val) => onChangConfirmPassword(val)}
                isError={errorPass}
                speaker={confirmPassHint}
              />
              <img
                className="eye-icon"
                src="/images/authen/show-password.png"
                onClick={toggleRePassword}
              />
            </div>
            {errorPass && (
              <div className="error-contain">
                <img className="warning-img" src="/images/authen/warning.png" />
                <span className={'form-error-message'}>{errorPass} </span>
              </div>
            )}
          </div>

          <div className="policy-contain">
            <Checkbox
              onChange={() => {
                setAcceptPolicy(!acceptPolicy)
                setErrorPolicy(null)
              }}
              checked={acceptPolicy}
            />
            <p className="policy">
              Tôi đồng ý với các
              <span className="policy-bold"> điều khoản</span> và{' '}
              <span className="policy-bold">chính sách bảo mật</span> của Test
              Bank
            </p>
          </div>
          {errorPolicy && (
            <div className="error-contain">
              <img className="warning-img" src="/images/authen/warning.png" />
              <span className={'form-error-message'}>{errorPolicy} </span>
            </div>
          )}
          <div className="form-row submit-group">
            <Button className="submit-btn" size="lg" onClick={onSubmit}>
              Đăng ký
            </Button>
          </div>
        </form>
        {/* <p className="m-login-form__social-regis">
          Hoặc đăng ký bằng
        </p>
        <div className="m-login-form__social" >
          <Button className="facebook-btn" size="lg" onClick={onLoginSocial.bind(null, 'facebook')}>
            <img className="auth-icon" src="/images/authen/facebook.png" />
            Facebook
          </Button>
          <Button className="google-btn" size="lg" onClick={onLoginSocial.bind(null, 'google')}>
            <img className="auth-icon" src="/images/authen/google.png" />
            Google
          </Button>
        </div> */}
        <p className="m-login-form__description">
          Bạn đã có tài khoản?
          <span className="register" onClick={() => router.replace('/login')}>
            {' '}
            Đăng nhập
          </span>
        </p>
      </div>
    )
  }

  function renderOTP() {
    return (
      <div className={`m-login-form`}>
        <p className="m-login-form__title">Tạo tài khoản mới</p>
        <p className="m-login-form__forgot-email-des">
          Chúng tôi đã gửi mã xác nhận đến email
        </p>
        <p className="m-login-form__forgot-email">{email}</p>
        <OtpInput
          value={OTP}
          onChange={(otp: any) => onChangeOTP(otp)}
          numInputs={6}
          inputStyle={
            errorOtp
              ? {
                  width: '4.5rem',
                  height: '4rem',
                  margin: '0 0.8rem 0 0',
                  fontSize: '2rem',
                  fontWeight: '600',
                  borderRadius: 8,
                  border: '1px solid #C96851',
                }
              : {
                  width: '4.5rem',
                  height: '4rem',
                  margin: '0 0.8rem 0 0',
                  fontSize: '2rem',
                  fontWeight: '600',
                  borderRadius: 8,
                  border: '1px solid #D5DEE8',
                }
          }
          focusStyle={
            errorOtp
              ? { border: '1px solid #C96851' }
              : { border: '1px solid #6868AC' }
          }
        />
        {errorOtp && (
          <div className="error-contain-otp">
            <img className="warning-img" src="/images/authen/warning.png" />
            <span className={'otp-error-message'}>{errorOtp}</span>
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
            minutes === 0 && seconds === 0 ? 'resend-otp-active' : 'resend-otp'
          }`}
          onClick={reSendOtp}
        >
          Gửi lại mã OTP
        </p>
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
        <p className="m-login-form__title">Đăng ký thành công</p>
        <p className="m-login-form__forgot-email-des">
          Đăng ký tài khoàn thành công, vui lòng đăng nhập để trải nghiệm sản
          phẩm Test Bank
        </p>
        <form className="m-login-form__container">
          <div className="form-row submit-group">
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

  return (
    <div>
      {step === REGISTER_STEP.INPUT_MAIL && renderInputMail()}
      {step === REGISTER_STEP.OTP && renderOTP()}
      {step === REGISTER_STEP.REGISTER_SUCCESS && renderSuccess()}
    </div>
  )
}
