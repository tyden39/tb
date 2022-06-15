import { GetServerSideProps } from 'next'
import { getCsrfToken, getSession } from 'next-auth/client'

import { LoginContext } from 'interfaces/contexts'
import { FogotPassword } from 'components/pages/forgot-password'

type PropsType = {
  csrfToken: string
}

const ForgotPasswordPage = ({ csrfToken }: PropsType) => {
  return (
    <LoginContext.Provider value={{ csrfToken }}>
      <FogotPassword />
    </LoginContext.Provider>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const csrfToken = await getCsrfToken(context)

  if (session) {
    const user: any = session.user
    return {
      redirect: {
        destination: user.redirect ?? '/questions',
        permanent: false,
      },
    }
  }

  return { props: { csrfToken: csrfToken || null } }
}

export default ForgotPasswordPage
