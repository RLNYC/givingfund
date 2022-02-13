import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Divider, List, Card } from 'antd';
import * as htmlToImage from 'html-to-image';
import  axios from "axios";

import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from '../config';
import { convertBase64ToImage }  from '../utils/convertImage';
import Wheel from '../components/Wheel';
import PrizeInformationCard from '../components/PrizeInformationCard';
import ResultModal from '../components/ResultModal';

function SpinWheel({ walletAddress, ethProvider, stakeWheelBlockchain, ticketTokenBlockchain, myWinnings, setMyWinnings }) {
  const [wheelclass, setWheelclass] = useState("box");
  const [avaxBalance, setAvaxBalance] = useState(0);
  const [oneToUSDBalance, setOneToUSDBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [winningURL, setWinnginURL] = useState("");
  const [wonOne, setWonOne] = useState(0);
  const [usedTickets, setUsedTickets] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(stakeWheelBlockchain){
      getBalance();
    }
  }, [stakeWheelBlockchain])

  useEffect(() => {
    if(ticketTokenBlockchain) getTicketToken();
  }, [ticketTokenBlockchain])

  const getBalance = async () => {
    const balance = await ethProvider.getBalance(walletAddress);
    setAvaxBalance(balance.toString());
  }

  const getTicketToken = async () => {
    const amount = await ticketTokenBlockchain.balanceOf(walletAddress);
    setTokenBalance(amount);
  }

  const takeScreenShot = async () => {
    const node = document.getElementById('wheelgame');
    const imageBase64 = await htmlToImage.toPng(node);
    console.log(imageBase64);

    const imageData = convertBase64ToImage(imageBase64, "winningimg");
    console.log(imageData);

    const form = new FormData();
    form.append('file', imageData);

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", form, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY, 
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      }
    })
    const cidLink = "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash;
    console.log(cidLink);
    setWinnginURL(cidLink);
  }

  const startRotation = (wheelNumber) => {
    setWheelclass("box start-rotate");
    setTimeout(async () => {
      setWheelclass("box start-rotate stop-rotate");
      setIsModalVisible(true);
      takeScreenShot();
    }, (1000 + (125 * +wheelNumber)))
  }

  const earnToken = async () => {
    try{
      setLoading(true);
      const transaction = await stakeWheelBlockchain.useTicketToken();
      const tx = await transaction.wait();
      console.log(tx);
      setUsedTickets(usedTickets + 1);
      setWonOne(tx.events[tx.events.length - 1].args.amount.toString());
      setResult(tx.events[tx.events.length - 1].args.result);
      startRotation(tx.events[tx.events.length - 1].args.wheelNumber.toString());

      setMyWinnings([...myWinnings, { "id": myWinnings.length + 1, "result": tx.events[tx.events.length - 1].args.result, "amount": tx.events[tx.events.length - 1].args.amount.toString()}])
      setLoading(false);
      getTicketToken();
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <Card>
      <Row id="wheelgame" gutter={16}>
        <Col className="gutter-row" xs={{ span: 32 }} lg={{ span: 12 }}>
          <Wheel
            wheelclass={wheelclass}
            loading={loading}
            earnToken={earnToken}/>
        </Col>
        <Col className="gutter-row" xs={{ span: 32 }} lg={{ span: 12 }}>
          <Typography.Title level={2} style={{ marginTop: '8rem'}}>
            Your Spin Tickets: {tokenBalance / 10 ** 18}
          </Typography.Title >
          
          <Divider orientation="left">Your Winnings</Divider>
          <List
            style={{ backgroundColor: 'white'}}
            bordered
            itemLayout="horizontal">
              <List.Item>
                <List.Item.Meta
                  title={`AVAX : ${wonOne / 10 ** 18}`}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={`Spin Tickets : ${usedTickets}`}
                />
              </List.Item>
          </List>
        </Col>
      </Row>

      <Divider orientation="left">Prize Information</Divider>
      <PrizeInformationCard />

      <ResultModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        result={result}
        winningURL={winningURL} />
    </Card>
  )
}

export default SpinWheel;
