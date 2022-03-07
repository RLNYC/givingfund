import React from 'react';
import { Row, Col, Card, Skeleton } from 'antd';


function CardLoading() {
  return (
    <Row gutter={16}>
      {Array(3).fill(1).map((el, i) => (
        <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 8 }} key={i + el}>
          <Card>
            <Skeleton active />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default CardLoading;