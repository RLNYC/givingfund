import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import { STAKE_WHEEL_ADDRESS, STAKE_TOKEN_ADDRESS, TICKET_TOKEN_ADDRESS, GIFT_TOKEN_ADDRESS } from '../config';
import StakeWheel from '../artifacts/contracts/StakeWheel.sol/StakeWheel.json';
import StakeToken from '../artifacts/contracts/StakeToken.sol/StakeToken.json';
import TicketToken from '../artifacts/contracts/TicketToken.sol/TicketToken.json';
import GiftToken from '../artifacts/contracts/GiftToken.sol/GiftToken.json';
import Logo from '../assets/logo.png';

function Navbar({ walletAddress, setWalletAddress, setEthProvider, setStakeWheelBlockchain, setStakeTokenBlockchain, setTicketTokenBlockchain, setGiftTokenBlockchain }) {
  const connetToWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);  
    console.log(provider);
    setEthProvider(provider);

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);

    let contract = new ethers.Contract(STAKE_WHEEL_ADDRESS, StakeWheel.abi, signer);
    setStakeWheelBlockchain(contract);

    let contract2 = new ethers.Contract(TICKET_TOKEN_ADDRESS, TicketToken.abi, signer);
    setTicketTokenBlockchain(contract2);

    let contract3 = new ethers.Contract(STAKE_TOKEN_ADDRESS, StakeToken.abi, signer);
    setStakeTokenBlockchain(contract3);

    let contract4 = new ethers.Contract(GIFT_TOKEN_ADDRESS, GiftToken.abi, signer);
    setGiftTokenBlockchain(contract4);
  }

  return (
    <Layout.Header className="white-bg-color" style={{ display: 'flex', alignItems: 'center',  padding: '0 6.5rem'}}>
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
          <Link to="/stake">
            Stake
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/spin">
            Spin
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/gift">
            Donate
          </Link>
        </Menu.Item>
        {walletAddress && <Menu.Item key="5">
          <Link to="/myaccount">
            My Account
          </Link>
        </Menu.Item>}
        <Menu.Item key="6">
          <Link to="/faucet">
            Faucet
          </Link>
        </Menu.Item>
      </Menu>
      {!walletAddress
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
      }
    </Layout.Header>
  )
}

export default Navbar;