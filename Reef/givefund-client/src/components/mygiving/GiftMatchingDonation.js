import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Form, InputNumber, Input, Button, Typography } from 'antd';

import CardLoading from '../CardLoading';

function GiftMatchingDonation({ walletAddress, ethProvider, givingFundBlockchain }) {
  const [form] = Form.useForm();

  const [ethBalance, setETHBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositLoading, setDepositLoading] = useState(false);
  const [nftsLoading, setNftsLoading] = useState(false);
  const [nfts, setNFTs] = useState([]);
  const [sentAmount, setSentAmount] = useState(0);
  const [transactionHash, setTransactionHash] = useState('');

  useEffect(() => {
    if(walletAddress) getBalance();
  }, [walletAddress]);

  useEffect(() => {
    if(givingFundBlockchain) getNFTs();
  }, [givingFundBlockchain]);

  const getNFTs = async () => {
    try{
      setNftsLoading(true);
      const totalSupply = await givingFundBlockchain._tokenIds();
      let oldnfts = [];

      for(let i = 1; i <= +totalSupply; i++){
        const tokenOwner = await givingFundBlockchain.ownerOf(i);
        
        if(tokenOwner === walletAddress){
          let data = await givingFundBlockchain.giftList(i);
          console.log(data);
          oldnfts.push(data);
          setSentAmount(sentAmount + +data.amount.toString());
        }
      }
      console.log(oldnfts);
      setNFTs(oldnfts);
      setNftsLoading(false);
    } catch(error) {
      console.error(error);
      setNftsLoading(false);
    }
  }

  const getBalance = async () => {
    const balance = await ethProvider.getBalance(walletAddress);
    setETHBalance(balance.toString());
  }

  const updateDeposit = (value) => {
    setDepositAmount(value);
  }

  const depositFund = async () => {
    try {
      setDepositLoading(true);

      const ethToWei = ethers.utils.parseUnits(depositAmount.toString(), 'ether');
      const transaction = await givingFundBlockchain.mintMatchingGiftNFT({ value: ethToWei });
      const tx = await transaction.wait();
      console.log(tx);

      setTransactionHash(tx.transactionHash);
      getBalance();
      setDepositAmount(0);
      await getNFTs();
      setDepositLoading(false);
    } catch(error) {
      console.error(error);
      setDepositLoading(false);
    }
  }

  const getDate = (dateTimeStamp) => {
    const date = new Date(dateTimeStamp * 1000); // x1000 to convert from seconds to milliseconds 
    let stringDate = date.toUTCString();
    stringDate = stringDate.substring(0, stringDate.indexOf("GMT")) + "UTC";
    return stringDate;
  }

  return (
    <div>
      <Typography.Title level={3}>
        Your sent matching gift:  {sentAmount / 10 ** 18} REEF
      </Typography.Title>
      <p>All unused matching donation gift will expired in in a year and refunded to your account</p>
      <Typography.Title level={3}>
        Your Available Funds for matching gift:  {ethBalance / 10 ** 18} REEF
      </Typography.Title>
      <Card>
        <Typography.Title level={4} style={{ marginTop: '0'}}>
          Create Matching Donation Gift
        </Typography.Title>
        
        <Form
          layout="inline"
          form={form}
        >
          <Form.Item label="Amount (REEF)">
            <InputNumber value={depositAmount} onChange={updateDeposit} />
          </Form.Item>
          <Form.Item>
            <Button className="primary-bg-color" type="primary" onClick={depositFund} loading={depositLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <br />

        {transactionHash && <Typography.Text type="success">
          Success, see transaction <a href={`https://testnet.reefscan.com/extrinsic/${transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionHash.substring(0, 10) + '...' + transactionHash.substring(41, 51)}</a>
        </Typography.Text> }
      </Card>

      <br />
      <Typography.Title level={3}>
        Your Matching Gift
      </Typography.Title>
      {nftsLoading
        ? <CardLoading />
        : <Row gutter={16}>
            {nfts.map(nft => (
              <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 8 }} key={nft.nftid.toString()}>
                <Card>
                  <h2>NFT Id: {nft.nftid.toString()}</h2>
                  <p>Matching Amount: {nft.amount.toString() / 10 ** 18} REEF</p>
                  <p>Start Date: {getDate(nft.startDate.toString())}</p>
                  <p>Original Funder: {nft.from.substring(0, 7) + '...' + nft.from.substring(35, 42)}</p>
                </Card>
              </Col>
            ))}
          </Row>
      }
    </div>
  )
}

export default GiftMatchingDonation;