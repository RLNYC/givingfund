import React, { useEffect, useState } from 'react';
import { Card, Typography, Statistic, Button } from 'antd';

function Faucet({ walletAddress, givingFundBlockchain, ticketTokenBlockchain }) {
  const [ticketTokenBalance, setTicketTokenBalance] = useState(0);
  
  useEffect(() => {
    if(ticketTokenBlockchain) getTicketTokenBalance();
  }, [ticketTokenBlockchain])

  const getTicketTokenBalance = async () => {
    const amount = await ticketTokenBlockchain.balanceOf(walletAddress);
    setTicketTokenBalance(amount);
  }

  const ticketFaucet = async () => {
    try{
      const transaction = await givingFundBlockchain.ticketTokenFaucet();
      const tx = await transaction.wait();
      console.log(tx);
      getTicketTokenBalance();
    } catch(error) {
      console.error(error);
    }
  }

  return <div>
    <Card>
      <Typography.Title style={{ marginTop: '0', marginBottom: '.5rem'}}>
        Faucet
      </Typography.Title>

      <Statistic title="Tickets Tokens" value={`${ticketTokenBalance / 10 ** 18}`} />
      <Button onClick={ticketFaucet} type="primary">
        Get 10 Ticket Faucet
      </Button>
    </Card>
  </div>;
}

export default Faucet;
