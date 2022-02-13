import React from 'react';
import { Link } from 'react-router-dom';
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
      ACCOUNT DASHBOARD
    </p>
    <Menu.Item key="Overview">
      Overview
    </Menu.Item>
    <Menu.Item key="Winnings">
      Winnings
    </Menu.Item>
    <Menu.Item key="Donations">
      Donations
    </Menu.Item>
  </Menu>;
}

export default Sidebar;
