import React from 'react'
import { ModalProvider, light, dark } from 'pancakeswap-uikit'
import { Web3ReactProvider } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { useThemeManager } from 'state/user/hooks'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import MetamaskProvider from "contexts/MetamaskContext"
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { AnchorContextProvider } from 'contexts/AnchorContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import store from 'state'

const ThemeProviderWrapper = (props) => {
  const [isDark] = useThemeManager()
  return <ThemeProvider theme={isDark ? dark : light} {...props} />
}

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AnchorContextProvider>
        <Provider store={store}>
          <ToastsProvider>
            <HelmetProvider>
              <ThemeProviderWrapper>
                <LanguageProvider>
                  <MetamaskProvider>
                    <ModalProvider>{children}</ModalProvider>
                  </MetamaskProvider>
                </LanguageProvider>
              </ThemeProviderWrapper>
            </HelmetProvider>
          </ToastsProvider>
        </Provider>
      </AnchorContextProvider>
    </Web3ReactProvider>
  )
}

export default Providers
