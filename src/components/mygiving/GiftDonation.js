import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Divider  } from 'antd';
import {
  HeartOutlined,
  SmileOutlined,
  TrophyOutlined
} from '@ant-design/icons';

import GiftFormCard from '../GiftFormCard';
import ChartiyIcon from '../../assets/charity1.png';

function GiftDonation({ walletAddress, givingFundBlockchain }) {
  const [occasionNum, setOccasionNum] = useState(1);
  const [nfts, setNFTs] = useState([]);

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
      }
    }
    console.log(oldnfts);
    setNFTs(oldnfts);
  }

  return (
    <div>
      <Card>
        <div style={{ display: "flex", alignItems: "center"}}>
          <img src={ChartiyIcon} alt="Chartiy" width={70} style={{ marginRight: "1rem" }} />
          <div>
            <p style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: 0, marginTop: "1rem"}}>
              Donate directly to charities or gift your donation tokens to your friends or family.
            </p>
            <p style={{ fontSize: "1rem", fontWeight: "bold"}}>
              Only verified charities are able to redeem donation tokens for cash.
            </p>
          </div>
        </div>
        
      </Card>
      <Divider orientation="left">Match donation of your friends and family members</Divider>
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
          givingFundBlockchain={givingFundBlockchain}
          nfts={nfts} />
      </Card>
    </div>
  )
}

export default GiftDonation;
