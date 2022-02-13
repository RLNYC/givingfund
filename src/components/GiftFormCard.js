import React, { useState } from 'react';
import { Spin, Row, Col, Form, Input, Button, message } from 'antd';
import Moralis from 'moralis';

const msgList = [
  "Just for you",
  "Thank you",
  "Congratulations"
];

function GiftFormCard({ giftTokenBlockchain }) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log(values);
      
      const redeemId = await sendGiftToken(values);

      Moralis.Cloud.run("sendEmailToUser", {
        email: values.recipient,
        fromemail: values.fromEmail,
        code: redeemId,
        tokenamount: values.amount
      });

      message.success('Email sent');
      setLoading(false);
    } catch(error){
      setLoading(false);
    }
  };

  const sendGiftToken = async (values) => {
    const transaction = await giftTokenBlockchain.sendTokenToSomeone((+values.amount * 10 ** 18).toString());
    const tx = await transaction.wait();
    console.log(tx);

    return tx.events[1].args.redeemId.toString();
  }

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} name="control-hooks" onFinish={onFinish} layout="vertical">
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
              name="amount"
              label="Gift Amount"
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
              <Input.TextArea rows={17} />
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
