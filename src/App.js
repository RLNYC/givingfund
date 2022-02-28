import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Moralis from 'moralis';

import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Spin from './pages/Spin';
import MyGiving from './pages/MyGiving';
import Faucet from './pages/Faucet';
import ClaimToken from './pages/ClaimToken';
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
          <Layout className="white-bg-color app-layout">
            <Layout.Content>
              <Routes>
                <Route path="/my-giving" element={
                  <MyGiving
                    walletAddress={walletAddress}
                    givingFundBlockchain={givingFundBlockchain}
                    ethProvider={ethProvider}
                    donationFundTokenBlockchain={donationFundTokenBlockchain}
                    ticketTokenBlockchain={ticketTokenBlockchain} />} >
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
                    givingFundBlockchain={givingFundBlockchain}
                    ticketTokenBlockchain={ticketTokenBlockchain} />} >
                </Route>
                <Route path="/claim/:redeedid" element={
                  <ClaimToken
                    walletAddress={walletAddress}
                    givingFundBlockchain={givingFundBlockchain} />} >
                </Route>
                <Route path="/" element={
                  <Home
                    givingFundBlockchain={givingFundBlockchain} /> } >
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
