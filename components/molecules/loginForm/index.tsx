import { useContext, useState } from 'react'

import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Button } from 'rsuite'

import { LoginContext } from 'interfaces/contexts'

import { DefaultPropsType } from '../../../interfaces/types'
import { InputPassword } from 'components/atoms/inputPassword'
import { InputCustom } from 'components/atoms/inputCustom'

export const LoginForm = ({ className = '', style }: DefaultPropsType) => {
  const { csrfToken } = useContext(LoginContext);
  const [error, setError] = useState(null);
  const [dataForm, setDataForm] = useState({
    email: '',
    password: ''
  })
  const [isPasswordType, setIsPassWordType] = useState(true);

  const router = useRouter()

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email: dataForm.email.trim(),
      password: dataForm.password.trim(),
    })
    if (result.ok) {
      if (!result.error) {
        window.location.reload()
      } else {
        setError(result.error)
      }
    }
  }

  const onChangeData = (type: string, value: string) => {
    const newData: any = { ...dataForm };
    newData[type] = value.trim();
    setError(null)
    setDataForm(newData);
  }

  const onLoginSocial = (type: string) => {
    signIn(type)
  }

  const togglePassword = () => {
    setIsPassWordType(!isPasswordType)
  }

  return (
    <div className={`m-login-form ${className}`} style={style}>
      <p className="m-login-form__title">Đăng nhập</p>
      <form
        className="m-login-form__container"
        autoComplete="new-password"
        onSubmit={onSubmit}
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className="form-row">
          <InputCustom
            className="info-input"
            label="Email/username"
            type="text"
            onChange={(val) => onChangeData('email', val)}
            autoFocus={true}
            isError={error}
          />
        </div>
        <div className="form-row spec-input">
          <div className="contai-pass">
            <InputPassword
              className="info-input"
              label="Mật khẩu"
              type={isPasswordType ? 'password' : 'text'}
              onChange={(val) => onChangeData('password', val)}
              isError={error}
              speaker={<div />}
            />
            <img
              className="eye-icon"
              src="/images/authen/show-password.png"
              onClick={togglePassword}
            />
          </div>
          {error && (
            <div className="error-contain">
              <img className="warning-img" src="/images/authen/warning.png" />
              <span className={'form-error-message'}>{error} </span>
            </div>
          )}
        </div>

        <div className="form-row submit-group">
          <Button className="submit-btn" size="lg" type="submit">
            Đăng nhập
          </Button>
          <p
            className="forget-pass"
            onClick={() => router.push('/forgot-password')}
          >
            Quên mật khẩu
          </p>
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
        Bạn chưa có tài khoản?
        <span className="register" onClick={() => router.push('/register')}>
          {' '}
          Đăng ký ngay
        </span>
      </p>
    </div>
  )
}
