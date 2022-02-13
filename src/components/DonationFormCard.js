import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import { Spin, Form, Input, Button, Select } from 'antd';
import { ethers } from 'ethers';

const layout = {
  labelCol: {
    span: 6,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 16,
    span: 16,
  },
};

function DonationFormCard({ giftTokenBalance, stakeWheelBlockchain, getPoolPrizeInfo, getBalance }) {
  const [form] = Form.useForm();

  const [usd, setUSD] = useState("0");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try{
      setLoading(true);
      console.log(values);

      const ethToWei = ethers.utils.parseUnits(values.donationAmount, 'ether');
      const transaction = await stakeWheelBlockchain.stakeforTokens({ value: ethToWei });
      const tx = await transaction.wait();
      console.log(tx);
      setLoading(false);
      getPoolPrizeInfo();
      getBalance();
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Spin spinning={loading}>
      <Card title="Donate directly to charities">
        <Typography.Title level={4} style={{ marginTop: '0', marginBottom: '1rem'}}>
          Your Available Donation Tokens: {giftTokenBalance / 10 ** 18}
        </Typography.Title>
        
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="charityList"
            label="Charity List"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select Chartiy (Drop down list)"
              allowClear
            >
              <Select.Option value="0x83eb0e2e36da037d4a2f9145a2544252421d52d0">Red Cross</Select.Option>
              <Select.Option value="0x41026a0c3880e0c6d19b0cdbb421f587f3029f40">Pet Shelter</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="donationAmount"
            label="Donation Amount"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="primary-bg-color">
              Donate
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  )
}

export default DonationFormCard;
