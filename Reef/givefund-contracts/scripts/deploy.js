const hre = require("hardhat");

// We will deploy Token contract with Bob
// It is going to have the pool of 1000000 tokens
async function main() {
  // define your testnet_account in hardhat.config.js and replace alice
  const testnetAccount = await hre.reef.getSignerByName("Test");
  await testnetAccount.claimDefaultAccount();

  const DonationFundToken = await hre.reef.getContractFactory("DonationFundToken", testnetAccount);
  const donationFundToken = await DonationFundToken.deploy();

  console.log("Deploy done");
  console.log({
    donationFundToken: donationFundToken.address,
  });
  console.log({
    name: await donationFundToken.name(),
  });

  const TicketToken = await hre.reef.getContractFactory("TicketToken", testnetAccount);
  const ticketToken = await TicketToken.deploy();

  console.log("Deploy done");
  console.log({
    ticketToken: ticketToken.address,
  });
  console.log({
    name: await ticketToken.name(),
  });

  const GivingFund = await hre.reef.getContractFactory("GivingFund", testnetAccount);
  const givingFund = await GivingFund.deploy(donationFundToken.address, ticketToken.address);

  console.log("Deploy done");
  console.log({
    givingFund: givingFund.address,
  });
  console.log({
    name: await givingFund.name(),
  });

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
