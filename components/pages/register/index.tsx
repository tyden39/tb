import { RegisterForm } from 'components/molecules/registerForm'

import { DefaultPropsType } from '../../../interfaces/types'

export const Register = ({ className = '', style }: DefaultPropsType) => {
  return (
    <div className={`p-login ${className}`} style={style}>
      <div className="p-login__banner">
        <div className="banner-image">
          <img 
            className="bg-teacher"
            src="/images/backgrounds/bg-teacher.png"
            alt="bg-teacher"
          />
        </div>
      </div>
      <div className="p-login__form">
        <RegisterForm />
      </div>
    </div>
  )
}
