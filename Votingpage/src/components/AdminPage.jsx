import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingSystemABI from '../abi/VotingSystemABI.json';

const AdminPage = () => {
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [voterAddress, setVoterAddress] = useState('');
  const [contract, setContract] = useState(null);

  const contractAddress = '0xa2dcb616b9f65ea003516dcfd3ca2ab957389f6b'; // Replace with your deployed contract address

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);

        const votingContract = new ethers.Contract(contractAddress, VotingSystemABI, signer);
        setContract(votingContract);

        const admin = await votingContract.admin();
        setIsAdmin(admin.toLowerCase() === accounts[0].toLowerCase());
      } else {
        alert('Please install MetaMask to use this application.');
      }
    };
    loadBlockchainData();
  }, []);

  const issueToken = async () => {
    if (isAdmin && contract) {
      await contract.issueToken(voterAddress);
      alert(`Token issued to ${voterAddress}`);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Connected account: {account}</p>
      {isAdmin ? (
        <div>
          <input 
            type="text" 
            placeholder="Voter Address" 
            value={voterAddress} 
            onChange={(e) => setVoterAddress(e.target.value)} 
          />
          <button onClick={issueToken}>Issue Token</button>
        </div>
      ) : (
        <p>You are not authorized to issue tokens.</p>
      )}
    </div>
  );
};

export default AdminPage;
