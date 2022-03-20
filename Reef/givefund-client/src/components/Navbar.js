import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Badge, Button } from 'antd';
import { ethers } from 'ethers';
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider
} from '@polkadot/extension-dapp';
import { Keyring, WsProvider } from "@polkadot/api";
import {
  Provider,
  Signer,
  TestAccountSigningKey,
} from "@reef-defi/evm-provider";

import { GIVING_FUND_ADDRESS, DONATION_FUND_TOKEN_ADDRESS, TICKET_TOKEN_ADDRESS, GIFT_TOKEN_ADDRESS } from '../config';
import GivingFund from '../artifacts/contracts/GivingFund.sol/GivingFund.json';
import DonationFundToken from '../artifacts/contracts/DonationFundToken.sol/DonationFundToken.json';
import TicketToken from '../artifacts/contracts/TicketToken.sol/TicketToken.json';
import Logo from '../assets/logo.png';

function Navbar({ walletAddress, setWalletAddress, setEthProvider, setGivingFundBlockchain, setDonationFundTokenBlockchain, setTicketTokenBlockchain }) {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  const connetToWallet = async () => {
    try {
      setLoading(true);

      const inj = await web3Enable("Reefswap");
      console.log(inj);
      const accounts = await web3Accounts();
      const acc = accounts[0];
      console.log(acc);

      const keySigner = inj[0].signer;
      console.log("Key singer: ", keySigner);

      const provider =  new Provider({
        provider: new WsProvider("wss://rpc-testnet.reefscan.com/ws")
      });
      await provider.api.isReady;
      console.log("Provider connected!");
      setEthProvider(provider);

      const wallet = new Signer(provider, acc.address, keySigner);
      const address = await wallet.getAddress();
      console.log(address);
      setWalletAddress(address);

      const reefBalance = await provider.getBalance(address);
      setBalance(reefBalance.toString());

      let contract = new ethers.Contract(GIVING_FUND_ADDRESS, GivingFund.abi, wallet);
      setGivingFundBlockchain(contract);

      let contract2 = new ethers.Contract(TICKET_TOKEN_ADDRESS, TicketToken.abi, wallet);
      setTicketTokenBlockchain(contract2);

      let contract3 = new ethers.Contract(DONATION_FUND_TOKEN_ADDRESS, DonationFundToken.abi, wallet);
      setDonationFundTokenBlockchain(contract3);
      
      setLoading(false);
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
    }
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
      {walletAddress && <Badge text={`${balance / 10 ** 18} REEF`} status="success" style={{marginRight: '1rem', fontSize: '1rem'}} /> }
      {!walletAddress
        ? <div>
            <Button
              className="primary-bg-color"
              style={{ marginBottom: '7px'}}
              type="primary"
              onClick={connetToWallet}
              loading={loading}
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