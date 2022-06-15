import { GetServerSideProps } from 'next'
import { getCsrfToken, getSession } from 'next-auth/client'

import { Login } from 'components/pages/login'
import { LoginContext } from 'interfaces/contexts'

type PropsType = {
  csrfToken: string
}

const LoginPage = ({ csrfToken }: PropsType) => {
  return (
    <LoginContext.Provider value={{ csrfToken }}>
      <Login />
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

export default LoginPage
