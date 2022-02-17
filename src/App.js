import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Moralis from 'moralis';

import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Spin from './pages/Spin';
import Gift from './pages/Gift';
import MyGiving from './pages/MyGiving';
import Faucet from './pages/Faucet';
import { MORALIS_APPID, MORALIS_SERVERURL} from './config';

const serverUrl = MORALIS_SERVERURL;
const appId = MORALIS_APPID;
Moralis.start({ serverUrl, appId });

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [ethProvider, setEthProvider] = useState(null);
  const [ticketTokenBlockchain, setTicketTokenBlockchain] = useState(null);
  const [donationFundTokenBlockchain, setDonationFundTokenBlockchain] = useState(null);
  const [givingFundBlockchain, setGivingFundBlockchain] = useState(null);
  const [myWinnings, setMyWinnings] = useState([]);

  return (
    <HashRouter>
      <Layout className="App">
        <Navbar
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          setEthProvider={setEthProvider}
          setGivingFundBlockchain={setGivingFundBlockchain}
          setDonationFundTokenBlockchain={setDonationFundTokenBlockchain}
          setTicketTokenBlockchain={setTicketTokenBlockchain} />
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
                <Route path="/gift" element={
                  <Gift
                    walletAddress={walletAddress}
                    ethProvider={ethProvider} />} >
                </Route>
                <Route path="/my-giving" element={
                  <MyGiving
                    walletAddress={walletAddress}
                    givingFundBlockchain={givingFundBlockchain}
                    donationFundTokenBlockchain={donationFundTokenBlockchain}
                    ticketTokenBlockchain={ticketTokenBlockchain}
                    myWinnings={myWinnings} />} >
                </Route>
                <Route path="/faucet" element={
                  <Faucet
                    walletAddress={walletAddress}
                    ticketTokenBlockchain={ticketTokenBlockchain}
                    givingFundBlockchain={givingFundBlockchain} />} >
                </Route>
                <Route path="/spin" element={
                  <Spin
                    walletAddress={walletAddress}
                    ethProvider={ethProvider}
                    GivingFundBlockchain={givingFundBlockchain}
                    ticketTokenBlockchain={ticketTokenBlockchain}
                    myWinnings={myWinnings}
                    setMyWinnings={setMyWinnings} />} >
                </Route>
                <Route path="/" element={
                  <Home
                    GivingFundBlockchain={givingFundBlockchain} /> } >
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
