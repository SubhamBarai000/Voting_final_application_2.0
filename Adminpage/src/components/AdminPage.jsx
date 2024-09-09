// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import VotingSystemABI from '../abi/VotingSystemABI.json';

// const AdminPage = () => {
//   const [account, setAccount] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [voterAddress, setVoterAddress] = useState('');
//   const [candidateId, setCandidateId] = useState('');
//   const [voteCount, setVoteCount] = useState(null); // State to store vote count
//   const [contract, setContract] = useState(null);

//   // Replace with your deployed contract address
//   //const contractAddress = '0xa2dcb616b9f65ea003516dcfd3ca2ab957389f6b'; 
//   const contractAddress = '0xdcbf26b8e10faf9c87e629020b90cc96b7dc2dce';

//   useEffect(() => {
//     const loadBlockchainData = async () => {
//       if (window.ethereum) {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const accounts = await provider.send('eth_requestAccounts', []);
//         setAccount(accounts[0]);

//         const votingContract = new ethers.Contract(contractAddress, VotingSystemABI, signer);
//         setContract(votingContract);

//         const admin = await votingContract.admin();
//         setIsAdmin(admin.toLowerCase() === accounts[0].toLowerCase());
//       } else {
//         alert('Please install MetaMask to use this application.');
//       }
//     };
//     loadBlockchainData();
//   }, []);

//   const issueToken = async () => {
//     if (!voterAddress) {
//       alert('Please enter a voter address');
//       return;
//     }

//     if (isAdmin && contract) {
//       try {
//         await contract.issueToken(voterAddress);
//         alert(`Token issued to ${voterAddress}`);
//       } catch (error) {
//         alert('An error occurred while issuing the token.');
//         console.error(error);
//       }
//     }
//   };

//   // Function to get the vote count for a specific candidate
//   const getVoteCount = async () => {
//     if (!candidateId) {
//       alert('Please enter a candidate ID');
//       return;
//     }

//     if (contract) {
//       try {
//         const count = await contract.getVotes(candidateId);
//         setVoteCount(count.toString());
//       } catch (error) {
//         alert('An error occurred while fetching the vote count.');
//         console.error(error);
//       }
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h1>Admin Page</h1>
//       <p>Connected account: {account}</p>
//       {isAdmin ? (
//         <div>
//           <div>
//             <input
//               type="text"
//               placeholder="Voter Address"
//               value={voterAddress}
//               onChange={(e) => setVoterAddress(e.target.value)}
//               style={styles.input}
//             />
//             <button onClick={issueToken} style={styles.button}>Issue Token</button>
//           </div>
//           <div>
//             <input
//               type="text"
//               placeholder="Candidate ID"
//               value={candidateId}
//               onChange={(e) => setCandidateId(e.target.value)}
//               style={styles.input}
//             />
//             <button onClick={getVoteCount} style={styles.button}>Get Vote Count</button>
//             {voteCount !== null && (
//               <p>Candidate {candidateId} has {voteCount} vote(s).</p>
//             )}
//           </div>
//         </div>
//       ) : (
//         <p>You are not authorized to issue tokens.</p>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     textAlign: 'center',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//   },
//   formContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '10px',
//   },
//   input: {
//     padding: '10px',
//     fontSize: '16px',
//     width: '300px',
//   },
//   button: {
//     padding: '10px 20px',
//     fontSize: '16px',
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     marginTop: '10px',
//   },
// };

// export default AdminPage;
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingSystemABI from '../abi/VotingSystemABI.json';
import './style/AdminPage.css'; // Import the CSS file

const AdminPage = () => {
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [voterAddress, setVoterAddress] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [contract, setContract] = useState(null);

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

        // Check if the connected account is the admin
        const owner = await votingContract.owner();
        setIsAdmin(owner.toLowerCase() === accounts[0].toLowerCase());

        // Fetch candidates and their votes
        const candidateList = await votingContract.getAllVotesOfCandidates();
        const candidateData = candidateList.map((candidate, index) => ({
          id: index,
          name: candidate.name,
          votes: candidate.voteCount.toString()
        }));
        setCandidates(candidateData);
      } else {
        alert('Please install MetaMask to use this application.');
      }
    };
    loadBlockchainData();
  }, []);

  const issueToken = async () => {
    if (isAdmin && contract) {
      if (!voterAddress) {
        alert("Please enter a voter address");
        return;
      }
      await contract.issueToken(voterAddress);
      alert(`Token issued to ${voterAddress}`);
    }
  };

  return (
    <div className="container">
      <h1>Admin Page</h1>
      <p>Connected account: {account}</p>

      {isAdmin ? (
        <div>
          {/* Token Issuance */}
          <input 
            type="text" 
            placeholder="Voter Address" 
            value={voterAddress} 
            onChange={(e) => setVoterAddress(e.target.value)} 
          />
          <button onClick={issueToken}>Issue Token</button>

          {/* Display Candidate Vote Counts */}
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
        </div>
      ) : (
        <p>You are not authorized to issue tokens or view votes.</p>
      )}
    </div>
  );
};

export default AdminPage;

