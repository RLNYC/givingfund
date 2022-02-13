import React, { useEffect, useState } from 'react';
import { Card, Typography, Statistic, Button, Form, Input } from 'antd';

const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 16,
    span: 16,
  },
};

function Faucet({ walletAddress, stakeWheelBlockchain, stakeTokenBlockchain, ticketTokenBlockchain }) {
  const [form] = Form.useForm();

  const [ticketTokenBalance, setTicketTokenBalance] = useState(0);
  const [stakeTokenBalance, setStakeTokenBalance] = useState(0);
  
  useEffect(() => {
    if(ticketTokenBlockchain) getTicketTokenBalance();
  }, [ticketTokenBlockchain])

  useEffect(() => {
    if(stakeTokenBlockchain) getStakeTokenBalance();
  }, [stakeTokenBlockchain])

  const getTicketTokenBalance = async () => {
    const amount = await ticketTokenBlockchain.balanceOf(walletAddress);
    setTicketTokenBalance(amount);
  }

  const getStakeTokenBalance = async () => {
    const amount = await stakeTokenBlockchain.balanceOf(walletAddress);
    setStakeTokenBalance(amount);
  }

  const onFinish = async (values) => {
    try{
      console.log(values);

      const transaction = await stakeWheelBlockchain.changeStakeDate(values.nftid, values.date);
      const tx = await transaction.wait();
      console.log(tx);
    } catch(error) {
      console.error(error);
    }
  };

  const stakeFaucet = async () => {
    try{
      const transaction = await stakeWheelBlockchain.stakeTokenFaucet();
      const tx = await transaction.wait();
      console.log(tx);
      getStakeTokenBalance();
    } catch(error) {
      console.error(error);
    }
  }

  const ticketFaucet = async () => {
    try{
      const transaction = await stakeWheelBlockchain.ticketTokenFaucet();
      const tx = await transaction.wait();
      console.log(tx);
      getTicketTokenBalance();
    } catch(error) {
      console.error(error);
    }
  }

  return <div>
    <Card>
      <Typography.Title style={{ marginTop: '0', marginBottom: '.5rem'}}>
        Faucet
      </Typography.Title>
      <Statistic title="Stake Tokens" value={`${stakeTokenBalance / 10 ** 18}`} />
      <Button onClick={stakeFaucet} type="primary">
        Get 10 Stake Faucet
      </Button>

      <br />
      <br />

      <Statistic title="Tickets Tokens" value={`${ticketTokenBalance / 10 ** 18}`} />
      <Button onClick={ticketFaucet} type="primary">
        Get 10 Ticket Faucet
      </Button>
    </Card>

    <Card>
      <Typography.Title style={{ marginTop: '0', marginBottom: '.5rem'}}>
        Change date of NFT
      </Typography.Title>

      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item
          name="nftid"
          label="NFTId"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Id" />
        </Form.Item>

        <Form.Item
          name="date"
          label="New Date"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="1111" />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </div>;
}

export default Faucet;
