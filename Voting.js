const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting, voting, owner, candidate1, voter1, voter2;
  const candidateFee = ethers.parseEther("0.1"); // Fee in Ether

  beforeEach(async function () {
    // Deploy the Voting contract
    Voting = await ethers.getContractFactory("Voting");
    [owner, candidate1, voter1, voter2] = await ethers.getSigners();
    voting = await Voting.deploy(candidateFee); // Deploy with 0.1 Ether candidate fee
  });

  it("Should set the correct candidate fee", async function () {
    expect(await voting.candidateFee()).to.equal(candidateFee);
  });

  it("Should allow a user to register as a candidate by paying the fee", async function () {
    const tx = await voting.connect(candidate1).registerAsCandidate("Alice", { value: candidateFee });
    await expect(tx).to.emit(voting, "CandidateAdded").withArgs(1, candidate1.address, "Alice");

    const candidate = await voting.candidates(1);
    expect(candidate.name).to.equal("Alice");
    expect(candidate.candidateAddress).to.equal(candidate1.address);
  });

  it("Should not allow a user to register as a candidate with insufficient funds", async function () {
    await expect(
      voting.connect(candidate1).registerAsCandidate("Alice", { value: ethers.parseEther("0.05") })
    ).to.be.revertedWith("Insufficient funds to register as a candidate");
  });

  it("Should allow the owner to whitelist voters", async function () {
    await voting.addVoter(voter1.address);
    expect(await voting.whitelist(voter1.address)).to.be.true;
  });

  it("Should not allow a non-whitelisted user to vote", async function () {
    await voting.connect(candidate1).registerAsCandidate("Alice", { value: candidateFee });
    await expect(voting.connect(voter1).vote(1)).to.be.revertedWith("User not authenticated to vote");
  });

  it("Should allow a whitelisted user to vote", async function () {
    await voting.connect(candidate1).registerAsCandidate("Alice", { value: candidateFee });
    await voting.addVoter(voter1.address);

    const tx = await voting.connect(voter1).vote(1);
    await expect(tx).to.emit(voting, "Voted").withArgs(voter1.address, 1);

    const candidate = await voting.candidates(1);
    expect(candidate.voteCount).to.equal(1);
  });

  it("Should not allow a user to vote twice", async function () {
    await voting.connect(candidate1).registerAsCandidate("Alice", { value: candidateFee });
    await voting.addVoter(voter1.address);
    await voting.connect(voter1).vote(1);

    await expect(voting.connect(voter1).vote(1)).to.be.revertedWith("User has already voted");
  });

  it("Should allow the owner to withdraw collected fees", async function () {
    await voting.connect(candidate1).registerAsCandidate("Alice", { value: candidateFee });
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

    const tx = await voting.withdrawFees();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.effectiveGasPrice;
    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

    expect(finalOwnerBalance).to.equal(initialOwnerBalance.add(candidateFee).sub(gasUsed));
  });
});
