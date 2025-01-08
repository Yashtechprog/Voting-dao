// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vote {
    // Struct to store candidate information
    struct Candidate {
        uint id;
        address candidateAddress;
        string name;
        uint voteCount;
    }

    // State variables
    address public owner;
    uint public candidateCount;
    uint public voterCount;
    uint public candidateFee; // Fee in wei required to become a candidate

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted; // Track whether an address has voted

    // Events
    event CandidateAdded(uint candidateId, address candidateAddress, string name);
    event Voted(address indexed voter, uint candidateId);

    // Modifier to restrict actions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(uint _candidateFee) {
        owner = msg.sender;
        candidateFee = _candidateFee;
    }

    // Function for a user to register as a candidate by paying a fee
    function registerAsCandidate(string memory _name) public payable {
        require(msg.value >= candidateFee, "Insufficient funds to register as a candidate");
        
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, msg.sender, _name, 0);
        
        emit CandidateAdded(candidateCount, msg.sender, _name);
    }

    // Vote for a candidate (any user can vote, and only once)
    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "User has already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");

        hasVoted[msg.sender] = true; // Mark the voter as having voted
        candidates[_candidateId].voteCount++; // Increment the vote count for the candidate
        
        emit Voted(msg.sender, _candidateId);
    }

    // Retrieve candidate vote count
    function getCandidateVoteCount(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        return candidates[_candidateId].voteCount;
    }

    // Withdraw collected fees by owner
    function withdrawFees() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
