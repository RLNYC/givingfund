import React from 'react';
import { Menu } from 'antd';

function Sidebar({ currentTab, setCurrentTab }) {
  const handleClick = e => {
    console.log('click ', e);
    setCurrentTab(e.key);
  };

  return <Menu
    onClick={handleClick}
    selectedKeys={[currentTab]}
    defaultOpenKeys={['sub1']}
    mode="inline"
  >
    <p style={{ margin: '1.4rem 0 1.4rem 1.4rem', fontWeight: 'bold'}}>
      GIVING DASHBOARD
    </p>
    <Menu.Item key="Donate">
      Donate
    </Menu.Item>
    <Menu.Item key="Gift Donation">
      Gift Donation
    </Menu.Item>
    <Menu.Item key="Gift Matching Donation">
      Gift Matching Donation
    </Menu.Item>
  </Menu>;
}

export default Sidebar;
