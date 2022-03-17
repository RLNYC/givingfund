import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Divider } from 'antd';
import {
  HeartOutlined,
  SmileOutlined,
  TrophyOutlined
} from '@ant-design/icons';

import GiftFormCard from '../GiftFormCard';

function GiftDonation({ walletAddress, givingFundBlockchain, donationFundTokenBlockchain }) {
  const [occasionNum, setOccasionNum] = useState(1);
  const [donationFundBalance, setDonationFundBalance] = useState(0);
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    if(givingFundBlockchain) getNFTs();
  }, [givingFundBlockchain]);

  useEffect(() => {
    if(donationFundTokenBlockchain) getDonationFundToken();
  }, [donationFundTokenBlockchain])

  const getDonationFundToken = async () => {
    const amount = await donationFundTokenBlockchain.balanceOf(walletAddress);
    setDonationFundBalance(amount);
  }

  const getNFTs = async () => {
    const totalSupply = await givingFundBlockchain.totalSupply();
    let oldnfts = [];

    for(let i = 1; i <= +totalSupply; i++){
      const tokenOwner = await givingFundBlockchain.ownerOf(i);
      
      if(tokenOwner === walletAddress){
        let data = await givingFundBlockchain.giftList(i);
        console.log(data);
        oldnfts.push(data);
      }
    }
    console.log(oldnfts);
    setNFTs(oldnfts);
  }

  return (
    <div>
      <Divider orientation="left">Match donation of your friends and family members</Divider>
      <Card>
        <p>What's the Occasion?</p>
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
          givingFundBlockchain={givingFundBlockchain}
          nfts={nfts}
          donationFundBalance={donationFundBalance} />
      </Card>
    </div>
  )
}

export default GiftDonation;
