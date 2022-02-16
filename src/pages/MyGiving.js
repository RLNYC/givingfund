import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';

import Sidebar from '../components/mygiving/Sidebar';

function MyGiving({ walletAddress }) {
  const [currentTab, setCurrentTab] = useState("Donate");

  let content;

  switch (currentTab) {
    case "Donate":
      content = <h1>Donate</h1>;
      break;
    case "Gift Donation":
      content = <h1>Gift Donation</h1>;
      break;
    case "Gift Matching Donation":
      content = <h1>Gift Matching Donation</h1>;
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
