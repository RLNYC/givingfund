import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Card, Row, Col, InputNumber, Typography, Button, Divider  } from 'antd';
import {
  HeartOutlined,
  SmileOutlined,
  TrophyOutlined
} from '@ant-design/icons';

import DonationFormCard from '../components/DonationFormCard';
import GiftFormCard from '../components/GiftFormCard';
import ChartiyIcon from '../assets/charity1.png';

function Gift({ walletAddress, ethProvider, giftTokenBlockchain }) {
  const [avaxBalance, setAvaxBalance] = useState(0);
  const [giftTokenBalance, setGiftTokenBalance] = useState(0);
  const [occasionNum, setOccasionNum] = useState(1);
  const [purchaseGiftTokensAmount, setPurchaseGiftTokensAmount] = useState(0);
  const [buyloading, setBuyLoading] = useState(false);

  useEffect(() => {
    if(giftTokenBlockchain) getGiftToken();
  }, [giftTokenBlockchain]);

  useEffect(() => {
    if(walletAddress) getBalance();
  }, [walletAddress]);

  const getBalance = async () => {
    const balance = await ethProvider.getBalance(walletAddress);
    setAvaxBalance(balance.toString());
  }

  const getGiftToken = async () => {
    const amount = await giftTokenBlockchain.balanceOf(walletAddress);
    setGiftTokenBalance(amount);
  }

  function setPurchaseGiftTokens(value) {
    setPurchaseGiftTokensAmount(value);
  }

  const buyToken = async () => {
    try {
      setBuyLoading(true);

      const ethToWei = ethers.utils.parseUnits(purchaseGiftTokensAmount.toString(), 'ether');
      const transaction = await giftTokenBlockchain.purchaseToken({ value: ethToWei });
      const tx = await transaction.wait();
      console.log(tx);

      getBalance();
      getGiftToken();

      setPurchaseGiftTokensAmount(0);
      setBuyLoading(false);
    } catch(error) {
      setBuyLoading(false);
    }
  }

  return (
    <div>
      <Card>
        <div style={{ display: "flex", alignItems: "center"}}>
          <img src={ChartiyIcon} alt="Chartiy" width={70} style={{ marginRight: "1rem" }} />
          <div>
            <p style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: 0, marginTop: "1rem"}}>
              Donate directly to charities or gift your donation tokens to your friends or family.
            </p>
            <p style={{ fontSize: "1.3rem", fontWeight: "bold"}}>
              Only verified charities are able to redeem donation tokens for cash.
            </p>
          </div>
        </div>
        <Row gutter={16}>
          <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 12 }}>
            <Card title="Purchase Gift Tokens">
              <Typography.Title level={4} style={{ marginTop: '0', marginBottom: '0'}}>
                Your Available AVAX tokens: {avaxBalance / 10 ** 18}
              </Typography.Title>
              <br />
              <p>Amount</p>
              <InputNumber value={purchaseGiftTokensAmount} onChange={setPurchaseGiftTokens} />
              <br />
              <br />
              <Button className="primary-bg-color" type="primary" onClick={buyToken} loading={buyloading}>
                Purchase
              </Button>
            </Card>
          </Col>
          <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 12 }}>
            <DonationFormCard giftTokenBalance={giftTokenBalance} />
          </Col>
        </Row>
      </Card>
      <Divider orientation="left">Gift Your Donation Token</Divider>
      <Card>
        <h2>What's the Occasion?</h2>
        <Row gutter={16}>
          <Col
            className="gutter-col"
            sm={{ span: 12 }}
            md={{ span: 4 }}
            style={ occasionNum !== 1 && { color: '#d0d2d6'} }
            onClick={() => setOccasionNum(1)}
          >
            <HeartOutlined className="gift__icon" />
            <p style={{ textAlign: 'center' }}>Just for you</p>
          </Col>
          <Col
            className="gutter-col"
            sm={{ span: 12 }}
            md={{ span: 4 }}
            style={ occasionNum !== 2 && { color: '#d0d2d6'} }
            onClick={() => setOccasionNum(2)}
          >
            <SmileOutlined className="gift__icon" />
            <p style={{ textAlign: 'center' }}>Thank you</p>
          </Col>
          <Col
            className="gutter-col"
            sm={{ span: 12 }}
            md={{ span: 4 }}
            style={ occasionNum !== 3 && { color: '#d0d2d6'} }
            onClick={() => setOccasionNum(3)}
          >
            <TrophyOutlined className="gift__icon" />
            <p style={{ textAlign: 'center' }}>Congratulations</p>
          </Col>
        </Row>

        <GiftFormCard
          occasionNum={occasionNum}
          walletAddress={walletAddress}
          giftTokenBlockchain={giftTokenBlockchain} />
      </Card>
    </div>
  )
}

export default Gift;
