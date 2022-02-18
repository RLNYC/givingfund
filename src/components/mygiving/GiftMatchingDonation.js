import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Card, InputNumber, Button, Typography } from 'antd';

function GiftMatchingDonation({ walletAddress, ethProvider, givingFundBlockchain }) {
  const [ethBalance, setETHBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositLoading, setDepositLoading] = useState(false);

  useEffect(() => {
    if(walletAddress) getBalance();
  }, [walletAddress]);

  const getBalance = async () => {
    const balance = await ethProvider.getBalance(walletAddress);
    setETHBalance(balance.toString());
  }

  const updateDeposit = (value) => {
    setDepositAmount(value);
  }

  const depositFund = async () => {
    try {
      setDepositLoading(true);

      const ethToWei = ethers.utils.parseUnits(depositAmount.toString(), 'ether');
      const transaction = await givingFundBlockchain.mintMatchingGiftNFT({ value: ethToWei });
      const tx = await transaction.wait();
      console.log(tx);

      getBalance();

      setDepositAmount(0);
      setDepositLoading(false);
    } catch(error) {
      console.error(error);
      setDepositLoading(false);
    }
  }

  return (
    <div>
      <Typography.Title level={3}>
        Your sent matching gift:  1 aETH
      </Typography.Title>
      <p>All unused matching donation gift will expired in in a year and refunded to your account</p>
      <Typography.Title level={3}>
        Your Available Funds for matching gift:  {ethBalance / 10 ** 18} aETH
      </Typography.Title>
      <Card>
        <Typography.Title level={4} style={{ marginTop: '0', marginBottom: '0'}}>
          Deposit Funds:
        </Typography.Title>
        <br />
        <p>Amount</p>
        <InputNumber value={depositAmount} onChange={updateDeposit} />
        <br />
        <br />
        <Button className="primary-bg-color" type="primary" onClick={depositFund} loading={depositLoading}>
          Submit
        </Button>
      </Card>

      <Card>
        <Typography.Title level={4} style={{ marginTop: '0', marginBottom: '0'}}>
          Withdraw Funds:
        </Typography.Title>
        <br />
        <p>Amount</p>
        <InputNumber />
        <br />
        <br />
        <Button className="primary-bg-color" type="primary">
          Submit
        </Button>
      </Card>
    </div>
  )
}

export default GiftMatchingDonation;