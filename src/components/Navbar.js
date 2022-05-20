import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import UAuth from '@uauth/js';

import { GIVING_FUND_ADDRESS, DONATION_FUND_TOKEN_ADDRESS, TICKET_TOKEN_ADDRESS, GIFT_TOKEN_ADDRESS } from '../config';
import GivingFund from '../artifacts/contracts/GivingFund.sol/GivingFund.json';
import DonationFundToken from '../artifacts/contracts/DonationFundToken.sol/DonationFundToken.json';
import TicketToken from '../artifacts/contracts/TicketToken.sol/TicketToken.json';
import Logo from '../assets/logo.png';

import {
  UNSTOPPABLEDOMAINS_CLIENT_ID,
  UNSTOPPABLEDOMAINS_REDIRECT_URI,
} from '../config';

const uauth = new UAuth({
  clientID: UNSTOPPABLEDOMAINS_CLIENT_ID,
  scope: 'openid email wallet',
  redirectUri: UNSTOPPABLEDOMAINS_REDIRECT_URI,
})

function Navbar({ walletAddress, setWalletAddress, setEthProvider, setGivingFundBlockchain, setDonationFundTokenBlockchain, setTicketTokenBlockchain }) {
  const [domainName, setDomainName] = useState('');

  const login = async () => {
    try {
        const authorization = await uauth.loginWithPopup();

        console.log(authorization);
        setDomainName(authorization.idToken.sub);
    } catch (error) {
        console.error(error);
    }
  }

  const connetToWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);  
    console.log(provider);
    setEthProvider(provider);

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);

    let contract = new ethers.Contract(GIVING_FUND_ADDRESS, GivingFund.abi, signer);
    setGivingFundBlockchain(contract);

    let contract2 = new ethers.Contract(TICKET_TOKEN_ADDRESS, TicketToken.abi, signer);
    setTicketTokenBlockchain(contract2);

    let contract3 = new ethers.Contract(DONATION_FUND_TOKEN_ADDRESS, DonationFundToken.abi, signer);
    setDonationFundTokenBlockchain(contract3);
  }

  return (
    <Layout.Header className="white-bg-color navbar">
      <Link to="/" style={{ marginRight: '2rem' }}>
        <img src={Logo} alt="Logo" width={180} />
      </Link>
      <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1 }}>
        <Menu.Item key="1">
          <Link to="/">
            Home
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/spin">
            Spin
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/my-giving">
            My Giving
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/faucet">
            Faucet
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/claim/0">
            Redeem
          </Link>
        </Menu.Item>
      </Menu>
      {!domainName
        ? <div>
            <Button
              className="primary-bg-color"
              style={{ marginBottom: '7px'}}
              type="primary"
              onClick={login}
            >
              Login with Unstoppable Domain
            </Button>
          </div>
        : <Button
            className="primary-bg-color"
            style={{ marginBottom: '7px'}}
            type="primary"
          >
            {domainName}
          </Button>
      }

      {/* {!walletAddress
        ? <div>
            <Button
              className="primary-bg-color"
              style={{ marginBottom: '7px'}}
              type="primary"
              onClick={connetToWallet}
            >
              Connect to Wallet
            </Button>
          </div>
        : <Button
            className="primary-bg-color"
            style={{ marginBottom: '7px'}}
            type="primary"
          >
            { walletAddress.substring(0, 7) + '...' + walletAddress.substring(35, 42) }
          </Button>
      } */}
    </Layout.Header>
  )
}

export default Navbar;