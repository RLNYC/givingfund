import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography } from 'antd';

import { getDate } from '../../utils/date'; 
import StakeModal from '../../components/StakeModal';

function Overview({ walletAddress, stakeWheelBlockchain }) {
  const [nfts, setNFTs] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectnftid, setSelectnftid] = useState(null);

  useEffect(() => {
    if(stakeWheelBlockchain) getNFTs();
  }, [stakeWheelBlockchain]);

  const getNFTs = async () => {
    const totalSupply = await stakeWheelBlockchain.totalSupply();
    let oldnfts = [];

    for(let i = 1; i <= +totalSupply; i++){
      const tokenOwner = await stakeWheelBlockchain.ownerOf(i);
      
      if(tokenOwner === walletAddress){
        let data = await stakeWheelBlockchain.stakelist(i);
        console.log(data);
        oldnfts.push(data);
      }
    }
    console.log(oldnfts);
    setNFTs(oldnfts);
  }

  const claimTicketTokens = async (nftId) => {
    try{
      setActionLoading(true);
      const transaction = await stakeWheelBlockchain.claimTicketTokens(nftId);
      const tx = await transaction.wait();
      console.log(tx);
      getNFTs();
      setActionLoading(false);
      setIsModalVisible(false);
    } catch(error) {
      console.error(error);
      setActionLoading(false);
    }
  }

  const unstakeAndBurnNFT = async (nftId) => {
    try{
      setActionLoading(true);
      const transaction = await stakeWheelBlockchain.unstakeToken(nftId);
      const tx = await transaction.wait();
      console.log(tx);
      getNFTs();
      setActionLoading(false);
      setIsModalVisible(false);
    } catch(error) {
      console.error(error);
      setActionLoading(false);
    }
  }

  const openPopup = (nft) => {
    setIsModalVisible(true);
    setSelectnftid(nft);
  }

  const columns = [
    {
      title: 'Deposit Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: text => <p>{getDate(text.toString())}</p>,
    },
    {
      title: 'Claim Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: text => <p>{getDate(+text.toString() + + 605543)}</p>,
    },
    {
      title: 'Deposits in Staking Pool',
      dataIndex: 'stakeAmount',
      key: 'stakeAmount',
      render: text => <p>{text.toString() / 10 ** 18} AVAX</p>,
    },
    {
      title: 'Upcoming Ticket Tokens',
      dataIndex: 'stakeAmount',
      key: 'stakeAmount',
      render: text => <p>{text.toString() / 10 ** 18 * 2} TKT</p>,
    },
    {
      title: 'Action',
      dataIndex: 'nftid',
      key: 'nftid',
      render: text => (
        <Space size="middle">
          <Button type="text" className="primary-color" onClick={() => openPopup(text.toString())}>
            Claim
          </Button>
        </Space>
      ),
    },
  ];

  return <div>
    <Typography.Title level={2}>
      Your Stake NFTS
    </Typography.Title>
    <Table columns={columns} dataSource={nfts} />
    <StakeModal
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
      actionLoading={actionLoading}
      claimTicketTokens={claimTicketTokens}
      unstakeAndBurnNF={unstakeAndBurnNFT}
      selectnftid={selectnftid} />
  </div>;
}

export default Overview;
