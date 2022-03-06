import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Form, Spin, Input, Card, Button } from 'antd';

const layout = {
  labelCol: {
    span: 5,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 10,
  },
};

function ClaimToken({ walletAddress, givingFundBlockchain }) {
  const { redeedid } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [transactionHash, setTransactionHash] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try{
      setLoading(true);
      console.log(values);

      const transaction = await givingFundBlockchain.redeemToken(values.giftcode);
      const tx = await transaction.wait();
      console.log(tx);
      setTransactionHash(tx.transactionHash);
      setFromAddress(tx.events[2].args.from);
      setLoading(false);
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="site-card-border-less-wrapper" style={{ display: 'flex', justifyContent: 'center'}}>
      <Spin spinning={loading}>
        <Card title="Redeem Your Friend’s Gift For Your Charitable Giving " bordered={false} style={{ width: 450, marginTop: "2rem", border: "1px solid black" }}>
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
                      Redeem
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            : <p>Connect to your wallet</p>
          }
          {transactionHash && 
            <div>
              <p>
                Success, <a href={`https://testnet.aurorascan.dev/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionHash}</a>
              </p>
              <p>
                Make a <a href={`https://twitter.com/intent/tweet?text=Horray,%20I%20received%20ETH%20of%20matching%20donation%20gift%20from%20${fromAddress}%20on%20GivingFund!`} target="_blank" rel="noopener noreferrer">Tweet</a>
              </p>
              <Button className="primary-bg-color" type="primary" onClick={() => navigate('/my-giving')}>
                Get STARTED
              </Button>
            </div>
          }
        </Card>
      </Spin>
    </div>
  )
}

export default ClaimToken;
