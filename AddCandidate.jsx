import { parseEther } from 'ethers';
import React, { useState } from 'react';

const AddCandidate = ({state,account}) => {
    const {contract} = state
  const [name, setName] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault(); 
    const tx = await contract.registerAsCandidate(name,{value : parseEther('0.001')})
    await tx.wait()
    console.log(tx)
    setName('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full transition-transform transform hover:scale-105">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register a Candidate</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              className="block w-full px-4 py-3 border-b-2 border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-blue-500 transition duration-200"
              required
            />
            <label className="absolute left-4 -top-3.5 text-gray-500 transition-all duration-200 transform scale-75 origin-top-left">
              Candidate Name
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
