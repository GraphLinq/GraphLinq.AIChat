import '@/styles/normalize.css'
import '@/styles/globals.scss'
import 'regenerator-runtime/runtime'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import localFont from 'next/font/local'

const Gilroy = localFont({
  src: [
    { path: './Gilroy-ExtraBold.woff2', weight: '700', style: 'normal' },
    { path: './Gilroy-Light.woff2', weight: '400', style: 'normal' },
  ]
})

function getLibrary(provider) {
  return new Web3(provider)
}

export default function App({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className={Gilroy.className}>
        <Component {...pageProps} />
      </div>
    </Web3ReactProvider>
  );
}
