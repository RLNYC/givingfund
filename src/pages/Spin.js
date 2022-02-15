import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';

import Sidebar from '../components/spin/Sidebar';
import SpinWheel from '../components/spin/SpinWheel';
import Winnings from '../components/spin/Winnings';

function Spin({ walletAddress, ethProvider, stakeWheelBlockchain, ticketTokenBlockchain, myWinnings, setMyWinnings }) {
  const [currentTab, setCurrentTab] = useState("Spin");

  let content;

  switch (currentTab) {
    case "Spin":
      content = <SpinWheel
        walletAddress={walletAddress}
        ethProvider={ethProvider}
        stakeWheelBlockchain={stakeWheelBlockchain}
        ticketTokenBlockchain={ticketTokenBlockchain}
        setMyWinnings={setMyWinnings} />;
      break;
    case "Winnings":
      content = <Winnings
        myWinnings={myWinnings} />;
      break;
    default:
      content = 'Page not found';
  }

  return <div>
    <Layout>
      <Layout.Sider
        width={210}
        className="white-bg-color"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      > 
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </Layout.Sider>
      <Layout className="white-bg-color" style={{ padding: '0 24px 24px', minHeight: '92vh' }}>
        <Layout.Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {content}
        </Layout.Content>
      </Layout>
    </Layout>
  </div>;
}

export default Spin;
