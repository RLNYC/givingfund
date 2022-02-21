import React, { useEffect, useState } from 'react';
import Typed from 'react-typed';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Button } from 'antd';
import { SmileOutlined, GlobalOutlined, SolutionOutlined, MoneyCollectOutlined } from '@ant-design/icons';

import PrizePoolCard from '../components/PrizePoolCard';
import HomeImg from '../assets/home-img.png';

function Home({ givingFundBlockchain }) {
  const navigate = useNavigate();

  const [donationTotal, setDonationTotal] = useState(0);
  const [poolPrize, setPoolPrize] = useState(0);
  const [awardedWon, setAwardedWon] = useState(0);
  const [charityAmount, setCharityAmount] = useState(0);

  useEffect(() => {
    if(givingFundBlockchain){
      getPoolPrizeInfo();
    }
  }, [givingFundBlockchain])

  const getPoolPrizeInfo = async () => {
    const donation = await givingFundBlockchain.totalDonation();
    setDonationTotal(donation);

    const prize = await givingFundBlockchain.prizePool();
    setPoolPrize(prize);

    const award = await givingFundBlockchain.prizePoolWon();
    setAwardedWon(award);

    const charity = await givingFundBlockchain.charityAmount();
    setCharityAmount(charity);
  }

  return <div>
     <br />
    <Row gutter={16}>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }}>
        <Typography.Title style={{ marginTop: '3rem', marginBottom: 0}}>
          Making Charitable Giving
        </Typography.Title>
        <Typography.Title className="primary-color" style={{ marginTop: 0, marginBottom: '1rem'}}>
          <Typed
            strings={[
              'Fun',
              'Widespread',
              'Transparent',
              'Lasting',
            ]}
            typeSpeed={80}
            loop={true}
          />
        </Typography.Title>
        <h2>For You, Families, Friends, Companies</h2>
        <Button className="primary-bg-color" type="primary" size="large" onClick={() => navigate('/my-giving')}>
          Get STARTED
        </Button>
      </Col>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }}>
        <center>
          <img src={HomeImg} alt="Home" width={300}/>
        </center>
      </Col>
    </Row>
    <br />
    <br />
    <br />
    <Row gutter={16}>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }} lg={{ span: 6}}>
        <Card>
          <center>
            <SmileOutlined style={{ fontSize: '3rem'}} />
            <h2>
              Fun
            </h2>
            <p>For every dollar of donation token, donors receive a ticket to spin a prize wheel and win a jackpot</p>
          </center>
        </Card>
      </Col>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }} lg={{ span: 6}}>
        <Card>
          <center>
            <GlobalOutlined style={{ fontSize: '3rem'}} />
            <h2>Widespread</h2>
            <p>Donation tokens and matching gifts can be re-gifted many times to raise awareness and incentivize potential donors</p>
          </center>
        </Card>
      </Col>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }} lg={{ span: 6}}>
        <Card>
          <center>
            <SolutionOutlined style={{ fontSize: '3rem'}} />
            <h2>Transparent</h2>
            <p>All chartiable giving of any individuals or companies are recoreded on blockchian and publicly available to all</p>
          </center>
        </Card>
      </Col>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }} lg={{ span: 6}}>
        <Card>
          <center>
            <MoneyCollectOutlined style={{ fontSize: '3rem'}} />
            <h2>Lasting</h2>
            <p>Interests are earned on donation fund tokens and the power of compounding would make more funds available for charities</p>
          </center>
        </Card>
      </Col>
    </Row>
    <br />
    <br />
    <PrizePoolCard
      donationTotal={donationTotal}
      poolPrize={poolPrize}
      awardedWon={awardedWon}
      charityAmount={charityAmount} />
  </div>;
}

export default Home;
