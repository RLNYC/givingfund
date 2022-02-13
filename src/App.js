import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Moralis from 'moralis';

import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Stake from './pages/Stake';
import SpinWheel from './pages/SpinWheel';
import Gift from './pages/Gift';
import MyAccount from './pages/MyAccount';
import Faucet from './pages/Faucet';
import { MORALIS_APPID, MORALIS_SERVERURL} from './config';

const serverUrl = MORALIS_SERVERURL;
const appId = MORALIS_APPID;
Moralis.start({ serverUrl, appId });

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [ethProvider, setEthProvider] = useState(null);
  const [ticketTokenBlockchain, setTicketTokenBlockchain] = useState(null);
  const [stakeTokenBlockchain, setStakeTokenBlockchain] = useState(null);
  const [stakeWheelBlockchain, setStakeWheelBlockchain] = useState(null);
  const [giftTokenBlockchain, setGiftTokenBlockchain] = useState(null);
  const [myWinnings, setMyWinnings] = useState([]);

  return (
    <HashRouter>
      <Layout className="App">
        <Navbar
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          setEthProvider={setEthProvider}
          setStakeWheelBlockchain={setStakeWheelBlockchain}
          setStakeTokenBlockchain={setStakeTokenBlockchain}
          setTicketTokenBlockchain={setTicketTokenBlockchain}
          setGiftTokenBlockchain={setGiftTokenBlockchain} />
        <Layout>
          <Layout className="white-bg-color" style={{ padding: '0 5rem 5rem', minHeight: '92vh' }}>
            <Layout.Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Routes>
                <Route path="/stake" element={
                  <Stake
                    walletAddress={walletAddress}
                    stakeWheelBlockchain={stakeWheelBlockchain}
                    stakeTokenBlockchain={stakeTokenBlockchain}
                    ethProvider={ethProvider} />} >
                </Route>
                <Route path="/gift" element={
                  <Gift
                    walletAddress={walletAddress}
                    ethProvider={ethProvider}
                    giftTokenBlockchain={giftTokenBlockchain} />} >
                </Route>
                <Route path="/myaccount" element={
                  <MyAccount
                    walletAddress={walletAddress}
                    stakeWheelBlockchain={stakeWheelBlockchain}
                    stakeTokenBlockchain={stakeTokenBlockchain}
                    ticketTokenBlockchain={ticketTokenBlockchain}
                    myWinnings={myWinnings} />} >
                </Route>
                <Route path="/faucet" element={
                  <Faucet
                    walletAddress={walletAddress}
                    stakeWheelBlockchain={stakeWheelBlockchain}
                    stakeTokenBlockchain={stakeTokenBlockchain}
                    ticketTokenBlockchain={ticketTokenBlockchain} />} >
                </Route>
                <Route path="/spin" element={
                  <SpinWheel
                    walletAddress={walletAddress}
                    ethProvider={ethProvider}
                    stakeWheelBlockchain={stakeWheelBlockchain}
                    ticketTokenBlockchain={ticketTokenBlockchain}
                    myWinnings={myWinnings}
                    setMyWinnings={setMyWinnings} />} >
                </Route>
                <Route path="/" element={
                  <Home
                    stakeWheelBlockchain={stakeWheelBlockchain} /> } >
                </Route>
              </Routes>
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    </HashRouter>
  );
}

export default App;
