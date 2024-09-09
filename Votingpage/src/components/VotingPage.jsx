// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import VotingSystemABI from '../abi/VotingSystemABI.json';

// const VotingPage = () => {
//   const [account, setAccount] = useState('');
//   const [candidateId, setCandidateId] = useState(1);
//   const [contract, setContract] = useState(null);
//   const [hasToken, setHasToken] = useState(false);
//   const [hasVoted, setHasVoted] = useState(false);

//   const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; // Replace with your deployed contract address

//   useEffect(() => {
//     const loadBlockchainData = async () => {
//       if (window.ethereum) {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const accounts = await provider.send('eth_requestAccounts', []);
//         setAccount(accounts[0]);

//         const votingContract = new ethers.Contract(contractAddress, VotingSystemABI, signer);
//         setContract(votingContract);

//         const tokenStatus = await votingContract.issuedTokens(accounts[0]);
//         setHasToken(tokenStatus);

//         const voteStatus = await votingContract.hasVoted(accounts[0]);
//         setHasVoted(voteStatus);
//       } else {
//         alert('Please install MetaMask to use this application.');
//       }
//     };
//     loadBlockchainData();
//   }, []);

//   const castVote = async () => {
//     if (hasToken && !hasVoted && contract) {
//       await contract.castVote(candidateId);
//       alert('Vote cast successfully');
//       setHasVoted(true);
//     }
//   };

//   return (
//     <div>
//       <h1>Voting Page</h1>
//       <p>Connected account: {account}</p>
//       {hasToken ? (
//         <div className='data'>
//           <input 
//             type="number" 
//             placeholder="Candidate ID" 
//             value={candidateId} 
//             onChange={(e) => setCandidateId(e.target.value)} 
//           />
//           <button onClick={castVote} disabled={hasVoted}>Cast Vote</button>
//           {hasVoted && <p>You have already voted.</p>}
//         </div>
//       ) : (
//         <p>You do not have a voting token. Please contact the admin.</p>
//       )}
//     </div>
//   );
// };

// export default VotingPage;


import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingSystemABI from '../abi/VotingSystemABI.json';
import './style/VotingPage.css'; // Import the CSS file

const VotingPage = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  const contractAddress = '0x76A0b5169b72330dDdE31F5D981DB59F08A6ca3b'; // Replace with your deployed contract address

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);

        const votingContract = new ethers.Contract(contractAddress, VotingSystemABI, signer);
        setContract(votingContract);

        // Fetch candidates
        const candidateList = await votingContract.getAllVotesOfCandidates();
        const candidateData = candidateList.map((candidate, index) => ({
          id: index,
          name: candidate.name,
          votes: candidate.voteCount.toString()
        }));
        setCandidates(candidateData);

        // Check voting status and remaining time
        const status = await votingContract.getVotingStatus();
        setVotingStatus(status);

        if (status) {
          const timeRemaining = await votingContract.getRemainingTime();
          setRemainingTime(timeRemaining);
          setInterval(async () => {
            const updatedTimeRemaining = await votingContract.getRemainingTime();
            setRemainingTime(updatedTimeRemaining);
          }, 1000);
        }

        // Check if the voter has already voted
        const voterStatus = await votingContract.voters(accounts[0]);
        setHasVoted(voterStatus);
      } else {
        alert('Please install MetaMask to use this application.');
      }
    };

    loadBlockchainData();
  }, []);

  const castVote = async () => {
    if (contract && selectedCandidate !== null && !hasVoted && votingStatus) {
      try {
        await contract.vote(selectedCandidate);
        alert('Vote cast successfully');
        setHasVoted(true);
      } catch (error) {
        console.error("Error casting vote:", error);
        alert(`An error occurred: ${error.message}`);
      }
    } else if (hasVoted) {
      alert('You have already voted.');
    } else if (!votingStatus) {
      alert('Voting has ended.');
    }
  };

  return (
    <div className="container">
      <h1>Voting Page</h1>
      <p>Connected account: {account}</p>

      {votingStatus ? (
        <>
          <p>Voting ends in: {Math.floor(remainingTime / 60)} minutes {remainingTime % 60} seconds</p>

          <div className="candidates-list">
            <h2>Candidates</h2>
            {candidates.length > 0 ? (
              <ul>
                {candidates.map(candidate => (
                  <li key={candidate.id}>
                    <input 
                      type="radio" 
                      id={`candidate-${candidate.id}`} 
                      name="candidate" 
                      value={candidate.id} 
                      onChange={(e) => setSelectedCandidate(e.target.value)} 
                    />
                    <label htmlFor={`candidate-${candidate.id}`}>{candidate.name}</label>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No candidates available.</p>
            )}
            
            <button onClick={castVote} disabled={hasVoted}>Cast Vote</button>
            {hasVoted && <p>You have already voted.</p>}
          </div>
        </>
      ) : (
        <p>Voting has ended.</p>
      )}
    </div>
  );
};

export default VotingPage;

