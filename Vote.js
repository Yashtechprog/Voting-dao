

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


const { ethers } = require("hardhat");

module.exports = buildModule("Vote", (m) => {
  const candidateFee = ethers.parseEther("0.001"); // Set candidate fee in Ether

  // Pass the candidate fee as a constructor argument
  const Vote = m.contract("Vote", [candidateFee]);

  return { Vote };
});
