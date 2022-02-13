import React from 'react';
import { Row, Col, Card } from 'antd';

import icon1 from '../assets/777Jackpot_50%.png'
import icon2 from '../assets/bigWin_25%.png';
import icon3 from '../assets/moneyBag_15%.png';
import icon4 from '../assets/money_10%.png';
import icon5 from '../assets/coin_5%.png';
import icon6 from '../assets/wheel 10 tickets.png';
import icon7 from '../assets/spin_ticket_5.png';
import icon8 from '../assets/better_luck.png';

function PrizeInformationCard() {
  return (
    <Row gutter={3} style={{ marginTop: '1rem' }}>
      <Col className="gutter-row" sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
        <Card>
          <img src={icon1} className="prize__icon" alt="won50%" />
          <Card.Meta title="50% Prize" description="50% of the prize pool" />
        </Card>
      </Col>
      <Col className="gutter-row" sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
        <Card>
          <img src={icon2} className="prize__icon" alt="won25%" />
          <Card.Meta title="25% Prize" description="25% of the prize pool" />
        </Card>
      </Col>
      <Col className="gutter-row" sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
        <Card>
          <img src={icon3} className="prize__icon" alt="won15%" />
          <Card.Meta title="15% Prize" description="15% of the prize pool" />
        </Card>
      </Col>
      <Col className="gutter-row" sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
        <Card>
          <img src={icon4} className="prize__icon" alt="won10%" />
          <Card.Meta title="10% Prize" description="10% of the prize pool" />
        </Card>
      </Col>
      <Col className="gutter-row" sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
        <Card>
          <img src={icon5} className="prize__icon" alt="won5%" />
          <Card.Meta title="5% Prize" description="5% of the prize pool" />
        </Card>
      </Col>
      <Col className="gutter-row" sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
        <Card>
          <img src={icon6} className="prize__icon" alt="free10" />
          <Card.Meta title="10 Tickets" description="Free 10 Ticket Tokens" />
        </Card>
      </Col>
      <Col className="gutter-row" sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
        <Card>
          <img src={icon7} className="prize__icon" alt="free5" />
          <Card.Meta title="5 Tickets" description="Free 5 Ticket Tokens" />
        </Card>
      </Col>
      <Col className="gutter-row" sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
        <Card>
          <img src={icon8} className="prize__icon" alt="nothing" />
          <Card.Meta title="Nothing" description="Sorry, Try again" />
        </Card>
      </Col>
    </Row>
  )
}

export default PrizeInformationCard;
