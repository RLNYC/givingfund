import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, InputNumber, Button, Typography } from 'antd';

function GiftMatchingDonation({ walletAddress, ethProvider, givingFundBlockchain }) {
  const [ethBalance, setETHBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositLoading, setDepositLoading] = useState(false);
  const [nfts, setNFTs] = useState([]);
  const [sentAmount, setSentAmount] = useState(0);

  useEffect(() => {
    if(walletAddress) getBalance();
  }, [walletAddress]);

  useEffect(() => {
    if(givingFundBlockchain) getNFTs();
  }, [givingFundBlockchain]);

  const getNFTs = async () => {
    const totalSupply = await givingFundBlockchain.totalSupply();
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

      getBalance();

      setDepositAmount(0);
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
        Your sent matching gift:  {sentAmount / 10 ** 18} aETH
      </Typography.Title>
      <p>All unused matching donation gift will expired in in a year and refunded to your account</p>
      <Typography.Title level={3}>
        Your Available Funds for matching gift:  {ethBalance / 10 ** 18} aETH
      </Typography.Title>
      <Card>
        <Typography.Title level={4} style={{ marginTop: '0', marginBottom: '0'}}>
          Deposit More Funds:
        </Typography.Title>
        <br />
        <p>Amount</p>
        <InputNumber value={depositAmount} onChange={updateDeposit} />
        <br />
        <br />
        <Button className="primary-bg-color" type="primary" onClick={depositFund} loading={depositLoading}>
          Submit
        </Button>
      </Card>

      <Card>
        <Typography.Title level={4} style={{ marginTop: '0', marginBottom: '0'}}>
          Withdraw Funds:
        </Typography.Title>
        <br />
        <p>Amount</p>
        <InputNumber />
        <br />
        <br />
        <Button className="primary-bg-color" type="primary">
          Submit
        </Button>
      </Card>
      <br />
      <Typography.Title level={3}>
        Your Matching NFTs
      </Typography.Title>
      <Row gutter={16}>
        {nfts.map(nft => (
          <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 8 }} key={nft.nftid.toString()}>
            <Card>
              <h2>NFT Id: {nft.nftid.toString()}</h2>
              <p>Matching Amount: {nft.amount.toString() / 10 ** 18} AVAX</p>
              <p>Start Date: {getDate(nft.startDate.toString())}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default GiftMatchingDonation;