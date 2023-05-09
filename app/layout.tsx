'use client'
import { Layout } from '@/components/dom/Layout'
import '@/global.css'

import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import { Suspense, ReactNode, useEffect, useContext } from 'react'
import { AudioProvider } from '@/context/AudioContext'

import { AccountProvider } from '@/context/AccountContext'
import { SceneContext, SceneProvider } from '@/context/SceneContext'
import { ViewProvider } from '@/context/ViewContext'

import { SoundProvider } from '@/context/SoundContext'
// import i18n (needs to be bundled ;))
import '@/lib/localization/i18n'
import { LanguageProvider } from '@/context/LanguageContext'
import '@/styles/root.sass'
import { fetchAll } from '@/utils/fetchFunctions'

const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

interface RootLayoutProps {
  children: ReactNode
}

const fetchData = () => {
  let status, result

  const manifestPromise = fetchAll()
  // const modelPromise = fetchModel()
  const suspender = manifestPromise.then(
    (r) => {
      status = 'success'
      result = r
    },
    (e) => {
      status = 'error'
      result = e
    },
  )

  return {
    read() {
      if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
      throw suspender
    },
  }
}
const resource = fetchData()

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* <Web3ReactProvider getLibrary={getLibrary}> */}
        <AccountProvider>
          <LanguageProvider>
            <AudioProvider>
              <ViewProvider>
                <SceneProvider>
                  <SoundProvider>
                    <Suspense>
                      <Layout>{children}</Layout>
                    </Suspense>
                  </SoundProvider>
                </SceneProvider>
              </ViewProvider>
            </AudioProvider>
          </LanguageProvider>
        </AccountProvider>
        {/* </Web3ReactProvider> */}
      </body>
    </html>
  )
}

export default RootLayout
