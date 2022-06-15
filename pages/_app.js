import { useState } from 'react'

import { Provider } from 'next-auth/client'
import Head from 'next/head'

import { AppContext } from '../interfaces/contexts'

import 'rsuite/dist/rsuite.min.css'
import '../styles/app.scss'

export default function App({ Component, pageProps }) {
  const [isExpandSidebar, setIsExpandSidebar] = useState(true)
  const [openingCollapseList, setOpenCollapseList] = useState([])

  return (
    <Provider
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
      }}
      session={pageProps.session}
    >
      <Head>
        <title>Test Bank - Giải Pháp Đề Thi Trắc Nghiệm</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <AppContext.Provider
        value={{
          isExpandSidebar: {
            state: isExpandSidebar,
            setState: setIsExpandSidebar,
          },
          openingCollapseList: {
            state: openingCollapseList,
            setState: setOpenCollapseList,
          },
        }}
      >
        <Component {...pageProps} />
      </AppContext.Provider>
    </Provider>
  )
}
