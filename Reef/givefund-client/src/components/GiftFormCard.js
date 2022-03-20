import React, { useEffect, useState } from 'react';
import { Spin, Row, Col, Form, Input, Select, Radio, Button, message } from 'antd';
import { ethers } from 'ethers';
import Moralis from 'moralis';

const msgList = [
  "Just for you",
  "Thank you",
  "Congratulations"
];

function GiftFormCard({ givingFundBlockchain, nfts, donationFundBalance }) {
  const [form] = Form.useForm();

  const [sendType, setSendType] = useState("");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log(values);

      let redeemId;

      if(sendType === "token"){
        const ethToWei = ethers.utils.parseUnits(values.donationFundToken, 'ether');
        const transaction = await givingFundBlockchain.giveDonationToken(ethToWei);
        const tx = await transaction.wait();
        console.log(tx);
        
        redeemId = tx.events[1].args.redeemId.toString();
        console.log(redeemId);
      }
      else {
        const transaction = await givingFundBlockchain.giveGiftNFT(values.matchingNFTs);
        const tx = await transaction.wait();
        console.log(tx);
        
        redeemId = tx.events[2].args.redeemId.toString();
        console.log(redeemId);
      }
      
      Moralis.Cloud.run("sendEmailToUser", {
        email: values.recipient,
        fromemail: values.fromEmail,
        code: redeemId,
        tokenamount: values.amount || 0
      });

      message.success('Email sent');
      setLoading(false);
    } catch(error){
      setLoading(false);
    }
  };

  const sendGiftToken = async (values) => {
    const transaction = await givingFundBlockchain.sendTokenToSomeone((+values.amount * 10 ** 18).toString());
    const tx = await transaction.wait();
    console.log(tx);

    return tx.events[1].args.redeemId.toString();
  }

  const onReset = () => {
    form.resetFields();
  };

  const onRadioChange = e => {
    console.log('radio checked', e.target.value);
    setSendType(e.target.value);
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} name="control-hooks" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="sendType"
          label="What to send as?"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group onChange={onRadioChange} value={sendType}>
            <Radio value="token">Token</Radio>
            <Radio value="nft">NFT</Radio>
          </Radio.Group>
        </Form.Item>

        {sendType === "token" && <Form.Item
            style={{ maxWidth:'450px'}}
            name="donationFundToken"
            label={`Donation Fund Token (Balance ${donationFundBalance / 10 ** 18} DFT)`}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input  type="number"/>
          </Form.Item>
        }

        {sendType === "nft" &&<Form.Item
          style={{ maxWidth:'450px'}}
          name="matchingNFTs"
          label="Matching NFTs"
          rules={[
            {
              required: true,
            },
          ]}
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
        }

        <Row gutter={16}>
          <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item
              name="recipient"
              label="Recipient Email"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="recipientName"
              label="Recipient Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="name"
              label="Your Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="fromEmail"
              label="Your Email"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col className="gutter-col" sm={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item
              name="message"
              label="Gift Message"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea rows={13} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="primary-bg-color">
            Send
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default GiftFormCard;
