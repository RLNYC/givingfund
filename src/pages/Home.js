import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';

import PrizePoolCard from '../components/PrizePoolCard';
import HomeImg from '../assets/home-img.png';

function Home({ stakeWheelBlockchain }) {
  const [donationTotal, setDonationTotal] = useState(0);
  const [poolPrize, setPoolPrize] = useState(0);
  const [awardedWon, setAwardedWon] = useState(0);
  const [charityAmount, setCharityAmount] = useState(0);

  useEffect(() => {
    if(stakeWheelBlockchain){
      getPoolPrizeInfo();
    }
  }, [stakeWheelBlockchain])

  const getPoolPrizeInfo = async () => {
    const donation = await stakeWheelBlockchain.totalDonation();
    setDonationTotal(donation);

    const prize = await stakeWheelBlockchain.prizePool();
    setPoolPrize(prize);

    const award = await stakeWheelBlockchain.prizePoolWon();
    setAwardedWon(award);

    const charity = await stakeWheelBlockchain.charityAmount();
    setCharityAmount(charity);
  }

  return <div>
    <PrizePoolCard
      donationTotal={donationTotal}
      poolPrize={poolPrize}
      awardedWon={awardedWon}
      charityAmount={charityAmount} />
  </div>;
}

export default Home;
