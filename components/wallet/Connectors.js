import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const injected = new InjectedConnector({
  supportedChainIds: [1, 614],
})


export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [1, 614],
})