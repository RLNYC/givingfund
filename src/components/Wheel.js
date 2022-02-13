import React from 'react';
import { Button } from 'antd';

import icon1 from '../assets/777Jackpot_50%.png'
import icon2 from '../assets/bigWin_25%.png';
import icon3 from '../assets/moneyBag_15%.png';
import icon4 from '../assets/money_10%.png';
import icon5 from '../assets/coin_5%.png';
import icon6 from '../assets/wheel 10 tickets.png';
import icon7 from '../assets/spin_ticket_5.png';
import icon8 from '../assets/better_luck.png';

function Wheel({ wheelclass, loading, earnToken }) {
  return (
    <div className="wheel">
      <div className="mainbox">
        <div className="arrow"></div>
        
        <div className={wheelclass}>
          <div className="box1">
            <span className="span1">
              <img src={icon2} className="icon" alt="won25%" />
            </span>
            <span className="span2">
              <img src={icon4} className="icon" alt="won10%" />
            </span>
            <span className="span3">
              <img src={icon7} className="icon" alt="free5" />
            </span>
            <span className="span4">
              <img src={icon8} className="icon" alt="nothing" />
            </span>
          </div>
          <div className="box2">
            <span className="span1">
              <img src={icon3} className="icon" alt="won15%" />
            </span>
            <span className="span2">
              <img src={icon1} className="icon" alt="won50%" />
            </span>
            <span className="span3">
              <img src={icon5} className="icon" alt="won5%" />
            </span>
            <span className="span4">
              <img src={icon6} className="icon" alt="free10" />
            </span>
          </div>
        </div>
        <button className="spin"></button>
          <Button className="primary-bg-color btn-spin" onClick={earnToken} type="primary" size="large" loading={loading}>
            SPIN (Cost 1 Ticket)
          </Button>
      </div>
    </div>
    
  )
}

export default Wheel;
