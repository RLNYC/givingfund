import React from 'react';
import { Table, Typography } from 'antd';

function Winnings({ myWinnings }) {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: text => <p>{text.toString() / 10 ** 18} AVAX</p>,
    },
  ];

  console.log("myWinnings", myWinnings)

  return <div>
    <Typography.Title level={2}>
      Your Winnings
    </Typography.Title>
    <Table columns={columns} dataSource={myWinnings} />
  </div>;
}

export default Winnings;
