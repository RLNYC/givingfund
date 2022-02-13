import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Button, InputNumber } from 'antd';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

function Stake({ walletAddress, stakeWheelBlockchain, stakeTokenBlockchain, ethProvider }) {
  const history = useNavigate();
  
  const [avaxBalance, setAvaxBalance] = useState(0);
  const [stakeTokenBalance, setStakeTokenBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [stakeLoading, setStakeLoading] = useState(false);

  useEffect(() => {
    if(stakeTokenBlockchain) getStakeToken();
  }, [stakeTokenBlockchain]);

  useEffect(() => {
    if(walletAddress) getBalance();
  }, [walletAddress]);
  
  const getStakeToken = async () => {
    const amount = await stakeTokenBlockchain.balanceOf(walletAddress);
    setStakeTokenBalance(amount);
  }

  const getBalance = async () => {
    const balance = await ethProvider.getBalance(walletAddress);
    setAvaxBalance(balance.toString());
  }

  const onChange = (value) => {
    console.log(value);
    setAmount(value);
  }

  const stakeforTokens = async (values) => {
    try{
      setStakeLoading(true);
      console.log(values);

      const ethToWei = ethers.utils.parseUnits(amount.toString(), 'ether');
      const transaction = await stakeWheelBlockchain.stakeforTokens({ value: ethToWei });
      const tx = await transaction.wait();
      console.log(tx);
      setStakeLoading(false);
      getBalance();
      setAmount();
    } catch(error) {
      console.error(error);
      setStakeLoading(false);
    }
  };

  return (
    <Card>
      <Typography.Title style={{ marginTop: '0', marginBottom: '.5rem'}}>
        Stake
      </Typography.Title>
      <Typography.Title level={5}>
        For every Avax deposit into our staking pool, you receive the following EVERY WEEK:
      </Typography.Title>
      <ul>
        <li>2 spin tickets</li>
        <li>Donation tokens based on your share of the staking pool and our staking award earned</li>
      </ul>
      <Typography.Title level={5}>
        You can redeem all your deposit back during non lock-up period.
      </Typography.Title>

      <br />

      {walletAddress
        ? <Row gutter={16}>
            <Col className="gutter-row" xs={{ span: 32 }} lg={{ span: 12 }}>
              <Card title={`Your Wallet: ${walletAddress}`}>
                <p>Available AVAX: {avaxBalance / 10 ** 18}</p>
                <p>Deposit Amount: <InputNumber max={avaxBalance / 10 ** 18} value={amount} onChange={onChange} /></p>
                <Button className="primary-bg-color" type="primary" onClick={stakeforTokens} loading={stakeLoading}>
                  Submit
                </Button>
              </Card>
            </Col>
            <Col className="gutter-row" xs={{ span: 32 }} lg={{ span: 12 }}>
              <Card title="Status">
                <Statistic title="Stake Tokens" value={`${stakeTokenBalance / 10 ** 18}`} />
                <p>Go to your account to see  your deposit and upcoming release date for spin tickets</p>
                <Button
                  className="primary-bg-color"
                  type="primary"
                  onClick={() => history('/myaccount')}
                >
                  Go to Dashboard
                </Button>
              </Card>
            </Col>
          </Row>
        : <p style={{ fontSize: "1.6rem", textAlign: 'center', color: 'red'}}>Please connet to your Wallet</p>
      }
    </Card>
  )
}

export default Stake;
