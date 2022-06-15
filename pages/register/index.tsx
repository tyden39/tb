import { GetServerSideProps } from 'next'
import { getCsrfToken, getSession } from 'next-auth/client'

import { Register } from 'components/pages/register'
import { LoginContext } from 'interfaces/contexts'

type PropsType = {
  csrfToken: string
}

const RegisterPage = ({ csrfToken }: PropsType) => {
  return (
    <LoginContext.Provider value={{ csrfToken }}>
      <Register />
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

export default RegisterPage
