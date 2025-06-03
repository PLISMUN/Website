import * as React from "react"
import Head from "next/head"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AppProps } from "next/app"
import "../styles/styles.scss"
import { wrapper } from "@/utils/redux/store"
import { ChakraProvider } from "@chakra-ui/react"
import { theme } from "@/utils/styles"
import { PersistGate } from "redux-persist/integration/react"
import { useStore } from "react-redux"
import Header from "@/components/header"

type MyAppProps = AppProps & {
  Component: React.Component &
    (
      | {
          mainPage: true
          pageName?: string
        }
      | {
          mainPage?: false
          pageName: string
        }
    )
}

function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props
  const store = useStore()

  return (
    <div>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>PLISMUN</title>
        <link rel="icon" type="image/png" href="/images/miniiconlogo2.png" />
      </Head>
      {/* @ts-expect-error due to the fact that __PERSISTOR is not default and ts will complain */}
      <PersistGate persistor={store.__PERSISTOR}>
        <ChakraProvider theme={theme}>
          <Navbar />
          {Component.mainPage ? (
            <Header mainPage />
          ) : (
            <Header title={Component.pageName} />
          )}
          <Component {...pageProps} />
          <Footer />
        </ChakraProvider>
      </PersistGate>
    </div>
  )
}

// add redux
export default wrapper.withRedux(MyApp)
