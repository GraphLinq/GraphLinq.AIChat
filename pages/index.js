import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Dictaphone from "@/components/Dictaphone";
import { useWeb3React } from "@web3-react/core";
import { injected, walletconnect } from "../components/wallet/Connectors";
import { useEffect, useRef, useState } from "react";
import Logo from "../public/logo.png";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();

  const inputRef = useRef();

  const [chatResponses, setChatResponses] = useState([]);
  const [userRequest, setUserRequest] = useState();
  const [mikeActive, setMikeActive] = useState(false);

  async function connect(connector) {
    try {
      await activate(connector === "metamask" ? injected : walletconnect);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function callApi(evt) {
    evt.preventDefault();

    setChatResponses((current) => [
      ...current,
      {
        who: "user",
        value: userRequest,
      },
    ]);

    setUserRequest('');
    inputRef.current.value = '';

    window.setTimeout(() => {
      setChatResponses((current) => [
        ...current,
        {
          who: "bot",
          value: "is typing ...",
        },
      ]);
    }, 500);

    try {
      const res = await fetch(
        "https://api-hosted.graphlinq.io/d0f19a36cc3bd4f60fe21bdd4f69879d6b11ce7b2381c44ee0c29cc71a3561e8/chat?chat_id=" +
          account,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userRequest,
          }),
        }
      ).then((res) => res.json());
  
      setChatResponses((current) => {
        const responses = [...current];
        responses.pop();

        return [
          ...responses,
          {
            who: "bot",
            value: res.response,
          },
        ]
      });
    } catch (error) {

      setChatResponses((current) => {
        const responses = [...current];
        responses.pop();

        return [
          ...responses,
          {
            who: "bot",
            value: "I am currently not available, please try again later.",
          },
        ]
      });
    }
  }

  async function handleChange(evt) {
    setUserRequest(evt.target.value);
  }

  useEffect(() => {
    setUserRequest(transcript);
  }, [transcript]);

  return (
    <>
      <Head>
        <title>GraphLinq Chat</title>
        <meta name="description" content="GraphLinq Chat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="glq-home">
        <Image src={Logo} className="glq-home-logo" />

        {active ? (
          <div className="glq-home-chat">
            <div className="glq-home-chat-list">
              {[...chatResponses].reverse().map((response) => (
                <div
                  className="glq-home-chat-response"
                  data-who={response.who}
                  key={response.value}
                >
                  <div className="glq-home-chat-response-who">
                    {response.who === "bot" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><g><rect fill="none" height="24" width="24" y="0"/></g><g><g><path d="M20,9V7c0-1.1-0.9-2-2-2h-3c0-1.66-1.34-3-3-3S9,3.34,9,5H6C4.9,5,4,5.9,4,7v2c-1.66,0-3,1.34-3,3s1.34,3,3,3v4 c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-4c1.66,0,3-1.34,3-3S21.66,9,20,9z M18,19L6,19V7h12V19z M9,13c-0.83,0-1.5-0.67-1.5-1.5 S8.17,10,9,10s1.5,0.67,1.5,1.5S9.83,13,9,13z M16.5,11.5c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S14.17,10,15,10 S16.5,10.67,16.5,11.5z M8,15h8v2H8V15z"/></g></g></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/></svg>
                    )}
                  </div>
                  <div className="glq-home-chat-response-value">
                    {response.value}
                  </div>
                </div>
              ))}
            </div>
            <form className="glq-home-chat-actions" onSubmit={callApi}>
              <input
                type="text"
                placeholder="What's your question ?"
                onChange={handleChange}
                ref={inputRef}
                value={userRequest}
              />
              <button type="submit" className="bt">
                Ask me
              </button>
              <div className="bt mike" data-active={listening} onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}>
              <svg xmlns="http://www.w3.org/2000/svg" enableackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g/><g><path d="M12,14c1.66,0,3-1.34,3-3V5c0-1.66-1.34-3-3-3S9,3.34,9,5v6C9,12.66,10.34,14,12,14z"/><path d="M17,11c0,2.76-2.24,5-5,5s-5-2.24-5-5H5c0,3.53,2.61,6.43,6,6.92V21h2v-3.08c3.39-0.49,6-3.39,6-6.92H17z"/></g></g></svg>
              </div>
            </form>
          </div>
        ) : (
          <div className="glq-home-intro">
            <div className="glq-home-title dg">
              Welcome to <span>GraphLinq Chat</span>
            </div>
            <div className="glq-home-desc">
              Alex is the public library of the internet, powered by OpenAI
              models. Ask any question, and it will find an answer. Give it a
              task, and it will deliver. Embrace the AI revolution.
            </div>

            <div className="glq-home-connect">
              <button
                className="bt metamask"
                onClick={() => connect("metamask")}
              >
                Connect to MetaMask
              </button>
              <button
                className="bt walletconnect"
                onClick={() => connect("walletconnect")}
              >
                Connect to WalletConnect
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
