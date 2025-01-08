import React, { useState, useEffect } from 'react';

const Vote = ({ state, account }) => {
  const { contract } = state;
  const [candidates, setCandidates] = useState([]);
  

  const showCandidates = async () => {
    const count = await contract.candidateCount();
    console.log(count ) // Make sure to use the correct function to get the candidate count
    const candidatesList = [];
    for (let i = 0; i < count; i++) {
      const candidate = await contract.candidates(i);
      console.log(candidate)
      candidatesList.push(candidate);
    }
    setCandidates(candidatesList);
  };

  useEffect(() => {
    if (contract) {
      showCandidates();
    }
  }, [contract]);

  const handleVote = async (candidateId) => {
    try {
      const tx = await contract.vote(candidateId);
      await tx.wait(); // Wait for the transaction to be mined
      alert(`Voted for candidate with ID: ${candidateId}`);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {candidates.map((candidate, index) => (
        <div key={index} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{candidate.name}</h2>
            <h2 className="card-title">{candidate.candidateAddress}</h2>
            <p>Vote Count: {candidate.voteCount}</p>
            <div className="card-actions justify-end">
              <button
                onClick={() => handleVote(candidate.id)}
                className="btn btn-primary"
              >
                Vote
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Vote;
