import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Card, Row, Col, Form, Select, Input, Button, Typography  } from 'antd';

import ChartiyIcon from '../../assets/charity1.png';
import DonationFormCard from '../DonationFormCard';

const layout = {
  labelCol: {
    span: 5,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 16,
    span: 16,
  },
};

function Donate({ walletAddress, ethProvider, givingFundBlockchain, donationFundTokenBlockchain }) {
  const [form] = Form.useForm();

  const [ethBalance, setETHBalance] = useState(0);
  const [donationFundBalance, setDonationFundBalance] = useState(0);
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(walletAddress) getBalance();
  }, [walletAddress]);

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
    const totalSupply = await givingFundBlockchain._tokenIds();
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

  const getBalance = async () => {
    const balance = await ethProvider.getBalance(walletAddress);
    setETHBalance(balance.toString());
  }

  const onFinish = async (values) => {
    try{
      setLoading(true);
      console.log(values);

      const ethToWei = ethers.utils.parseUnits(values.amount, 'ether');
      const transaction = await givingFundBlockchain.purchaseDonationFundToken(values.matchingNFTs || "0", { value: ethToWei });
      const tx = await transaction.wait();
      console.log(tx);
      setLoading(false);

      getBalance();
      getDonationFundToken();
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Card>
        <Card title=" Purchase Donation Fund Token">
          <Typography.Title level={4} style={{ marginTop: '0'}}>
          Your Available Funds:  {ethBalance / 10 ** 18} REEF
          </Typography.Title>
          <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            <Form.Item
              name="amount"
              label="Amount"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="matchingNFTs"
              label="Available Matching Gift"
            >
              <Select
                placeholder="Select your Matching NFTs (Drop down list)"
                allowClear
              >
                {nfts.map(nft => (
                  <Select.Option key={nft.nftid.toString()} value={nft.nftid.toString()}>
                    NFT#{nft.nftid.toString()} ({nft.amount.toString() / 10 ** 18} REEF)
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item {...tailLayout} loading={loading}>
              <Button type="primary" htmlType="submit" className="primary-bg-color">
                Submit
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          </Form>
          
          <p>* 1 REEF = 0.01 Donation Fund Token</p>
          <p>* You receive 1 spin ticket for every 100 REEF purchase of donation fund token.</p>
          <p>* Only verified charities are able to redeem donation tokens for cash.</p>
        </Card>

        <div style={{ display: "flex", alignItems: "center", margin: '1rem 0'}}>
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

        <DonationFormCard donationFundBalance={donationFundBalance} />
        
      </Card>
      
    </div>
  )
}

export default Donate;
