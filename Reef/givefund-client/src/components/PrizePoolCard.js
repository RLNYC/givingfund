import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

function PrizePoolCard({ donationTotal, poolPrize, awardedWon, charityAmount }) {
  return (
    <Card>
      <Row gutter={16} style={{ textAlign: "center"}}>
        <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 12 }}>
          <Statistic title="Total Giving Funds" value={`${donationTotal / 10 ** 18} REEF`} />
        </Col>
        <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 12 }}>
          <Statistic title="Total Prize Pool" value={`${poolPrize / 10 ** 18} REEF`} />
        </Col>
        <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 12 }}>
          <Statistic title="Total Charity Donation" value={`${charityAmount / 10 ** 18} REEF`} />
        </Col>
        <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 12 }}>
          <Statistic title="Total Winning Awarded" value={`${awardedWon / 10 ** 18} REEF`} />
        </Col>
      </Row>
    </Card>
  )
}

export default PrizePoolCard;
