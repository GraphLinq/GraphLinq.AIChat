import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Dictaphone from '@/components/Dictaphone'
import { useWeb3React } from "@web3-react/core"
import { injected, walletconnect } from "../components/wallet/Connectors"
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  const [chatResponse, setChatResponse] = useState()

  async function connect(connector) {
    try {
      await activate(connector === 'metamask' ? injected : walletconnect)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  async function callApi() {
    const res = await fetch('https://api-hosted.graphlinq.io/d0f19a36cc3bd4f60fe21bdd4f69879d6b11ce7b2381c44ee0c29cc71a3561e8/chat?chat_id=' + account, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "What is graphlinq protocol ?"
      })
    }).then((res) => res.json());

    setChatResponse(res.response);
  }
  
  return (
    <>
      <Head>
        <title>GraphLinq Chat</title>
        <meta name="description" content="GraphLinq Chat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>GraphLinq Chat</h1>

        <Dictaphone/>

        <div>
          <button onClick={() => connect('metamask')}>Connect to MetaMask</button>
          <button onClick={() => connect('walletconnect')}>Connect to WalletConnect</button>
          {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
          <button onClick={disconnect}>Disconnect</button>
        </div>

        {active ? <button onClick={callApi}>callApi</button> : null}
        {chatResponse}
      </div>
    </>
  )
}
