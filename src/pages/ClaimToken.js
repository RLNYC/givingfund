import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Spin, Input, Card, Button } from 'antd';

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

function ClaimToken({ walletAddress }) {
  const { redeedid } = useParams();
  const [form] = Form.useForm();

  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try{
      setLoading(true);
      console.log(values);
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="site-card-border-less-wrapper" style={{ display: 'flex', justifyContent: 'center'}}>
      <Spin spinning={loading}>
        <Card title="Redeem Your Friend’s Gift For Your Charitable Giving " bordered={false} style={{ width: 500 }}>
          {walletAddress
            ? <div>
                <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                  <Form.Item
                    name="giftcode"
                    label="Gift Code"
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
                  </Form.Item>
                </Form>
              </div>
            : <p>Connect to your wallet</p>
          }
          {transactionHash && <p>Success, {transactionHash}</p>}
        </Card>
      </Spin>
    </div>
  )
}

export default ClaimToken;
