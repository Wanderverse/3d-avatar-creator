'use client'
import { Layout } from '@/components/dom/Layout'
import '@/global.css'

import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import React, { Suspense, ReactNode } from 'react'
import { AudioProvider } from '@/context/AudioContext'

import { AccountProvider } from '@/context/AccountContext'
import { SceneProvider } from '@/context/SceneContext'
import { ViewProvider } from '@/context/ViewContext'

import { SoundProvider } from '@/context/SoundContext'

// import i18n (needs to be bundled ;))
import '@/lib/localization/i18n'
import { LanguageProvider } from '@/context/LanguageContext'
import '@/styles/root.sass'

// export const metadata = {
//   title: 'Next.js + Three.js',
//   description: 'A minimal starter for Nextjs + React-three-fiber and Threejs.',
// }

const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <React.StrictMode>
          <Web3ReactProvider getLibrary={getLibrary}>
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
          </Web3ReactProvider>
        </React.StrictMode>
      </body>
    </html>
  )
}

export default RootLayout
