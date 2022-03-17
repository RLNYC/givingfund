import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';

import Sidebar from '../components/mygiving/Sidebar';
import Donate from '../components/mygiving/Donate';
import GiftDonation from '../components/mygiving/GiftDonation';
import GiftMatchingDonation from '../components/mygiving/GiftMatchingDonation';

function MyGiving({ walletAddress, ethProvider, givingFundBlockchain, donationFundTokenBlockchain }) {
  const [currentTab, setCurrentTab] = useState("Donate");

  let content;

  switch (currentTab) {
    case "Donate":
      content = <Donate
                  walletAddress={walletAddress}
                  ethProvider={ethProvider}
                  givingFundBlockchain={givingFundBlockchain}
                  donationFundTokenBlockchain={donationFundTokenBlockchain} />;
      break;
    case "Gift Donation":
      content = <GiftDonation
                  walletAddress={walletAddress}
                  ethProvider={ethProvider}
                  givingFundBlockchain={givingFundBlockchain}
                  donationFundTokenBlockchain={donationFundTokenBlockchain} />;
      break;
    case "Gift Matching Donation":
      content = <GiftMatchingDonation
                  walletAddress={walletAddress}
                  ethProvider={ethProvider}
                  givingFundBlockchain={givingFundBlockchain} />;
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

export default MyGiving;
