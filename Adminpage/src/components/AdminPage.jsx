import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingSystemABI from '../components/VotingSystemABI.json'; // Import the ABI for the voting contract
import './style/AdminPage.css'; // Import the CSS file

const AdminPage = () => {
  // State to store the connected MetaMask account
  const [account, setAccount] = useState('');
  
  // State to check if the connected account is the admin
  const [isAdmin, setIsAdmin] = useState(false);

  // State to store the voter address for issuing tokens
  const [voterAddress, setVoterAddress] = useState('');

  // State to store the list of candidates with their vote counts
  const [candidates, setCandidates] = useState([]);

  // State to store transaction hashes for issued tokens
  const [transactionHashes, setTransactionHashes] = useState({});

  // State to store the contract instance
  const [contract, setContract] = useState(null);

  // Address of the deployed voting contract (replace with your actual contract address)
  const contractAddress = '0x2f03e9261dcbc143f87c45a60d123c8ca2e28821';

  // Function to handle account change (when the user switches MetaMask accounts)
  const handleAccountChange = async (newAccounts) => {
    if (newAccounts.length > 0) {
      setAccount(newAccounts[0]); // Set the new account
      
      // Create a new provider and signer for the updated account
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Reinitialize the contract instance with the new signer
      const votingContract = new ethers.Contract(contractAddress, VotingSystemABI, signer);
      setContract(votingContract);

      // Check if the new account is the admin by comparing with the contract owner
      const owner = await votingContract.owner();
      setIsAdmin(owner.toLowerCase() === newAccounts[0].toLowerCase());

      // Fetch the updated list of candidates and their votes
      const candidateList = await votingContract.getAllVotesOfCandidates();
      const candidateData = candidateList.map((candidate, index) => ({
        id: index,
        name: candidate.name,
        votes: candidate.voteCount.toString()
      }));
      setCandidates(candidateData);

      // Fetch the transaction hashes and addresses
      const issuedTokenAddresses = await votingContract.getIssuedTokenAddresses();
      const hashes = {};
      for (const address of issuedTokenAddresses) {
        const txHash = await votingContract.getTransactionHash(address);
        hashes[address] = txHash;
      }
      setTransactionHashes(hashes);
    } else {
      // If no accounts are connected, reset the account and admin state
      setAccount('');
      setIsAdmin(false);
    }
  };

  // Effect hook to load blockchain data when the component mounts
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        // Connect to MetaMask using ethers.js provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Request accounts from MetaMask and set the first account
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);

        // Initialize the contract instance
        const votingContract = new ethers.Contract(contractAddress, VotingSystemABI, signer);
        setContract(votingContract);

        // Check if the connected account is the admin (contract owner)
        const owner = await votingContract.owner();
        setIsAdmin(owner.toLowerCase() === accounts[0].toLowerCase());

        // Fetch candidates and their vote counts from the contract
        const candidateList = await votingContract.getAllVotesOfCandidates();
        const candidateData = candidateList.map((candidate, index) => ({
          id: index,
          name: candidate.name,
          votes: candidate.voteCount.toString()
        }));
        setCandidates(candidateData);

        // Fetch the transaction hashes and addresses
        const issuedTokenAddresses = await votingContract.getIssuedTokenAddresses();
        const hashes = {};
        for (const address of issuedTokenAddresses) {
          const txHash = await votingContract.getTransactionHash(address);
          hashes[address] = txHash;
        }
        setTransactionHashes(hashes);

        // Set up event listener for TokenIssued event
        votingContract.on('TokenIssued', (voter, txHash) => {
          setTransactionHashes(prevState => ({
            ...prevState,
            [voter]: txHash
          }));
        });
      } else {
        // Alert the user if MetaMask is not installed
        alert('Please install MetaMask to use this application.');
      }
    };

    // Load blockchain data on component mount
    loadBlockchainData();

    // Listen for account changes and call the handleAccountChange function
    window.ethereum.on('accountsChanged', handleAccountChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountChange);
    };
  }, []);

  // Function to issue a token to a voter and store the transaction hash
  const issueToken = async () => {
    // Ensure the user is the admin and the contract is loaded
    if (isAdmin && contract) {
      // Check if a valid voter address is entered
      if (!voterAddress) {
        alert("Please enter a voter address");
        return;
      }
      
      try {
        // Issue a token to the voter using the contract's issueToken function
        const tx = await contract.issueToken(voterAddress);
        
        // Wait for the transaction to be mined
        await tx.wait();
        
        alert(`Token issued to ${voterAddress}. Transaction Hash: ${tx.hash}`);
      } catch (error) {
        console.error("Error issuing token: ", error);
        alert("Error issuing token. Check the console for details.");
      }
    }
  };


  return (
    <div className="container">
      <h1>Admin Page</h1>
      {/* Display the connected account */}
      <p>Connected account: {account}</p>

      {/* If the user is the admin, show the token issuance form and candidate vote counts */}
      {isAdmin ? (
        <div>
          {/* Token Issuance Form */}
          <input 
            type="text" 
            placeholder="Voter Address" 
            value={voterAddress} 
            onChange={(e) => setVoterAddress(e.target.value)} 
          />
          <button onClick={issueToken}>Issue Token</button>

          {/* Display the list of candidates and their vote counts */}
          <h2>Candidate Vote Counts</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Vote Count</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display transaction hashes for issued tokens */}
          <h2>Issued Token Transactions</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Voter Address</th>
                <th>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(transactionHashes).length > 0 ? (
                Object.keys(transactionHashes).map((address, index) => (
                  <tr key={index}>
                    <td>{address}</td>
                    <td><a href={`https://etherscan.io/tx/${transactionHashes[address]}`} target="_blank" rel="noopener noreferrer">{transactionHashes[address]}</a></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No tokens have been issued yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // If the user is not the admin, display an unauthorized message
        <p>You are not authorized to issue tokens or view votes.</p>
      )}
    </div>
  );
};

export default AdminPage;
