// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import detectEthereumProvider from "@metamask/detect-provider";

// const VotingSystem = () => {
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [account, setAccount] = useState("");
//   const [totalVotes, setTotalVotes] = useState(0);
//   const [voteCounts, setVoteCounts] = useState([]);
//   const [admin, setAdmin] = useState("");

//   const CONTRACT_ADDRESS = "0x2057e569ffef26efec1625b1e19e79adf578775f"; // Replace with your deployed contract address
//   const CONTRACT_ABI =  [
//     {
//       "inputs": [],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "address",
//           "name": "voter",
//           "type": "address"
//         }
//       ],
//       "name": "TokenIssued",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "address",
//           "name": "voter",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "candidateId",
//           "type": "uint256"
//         }
//       ],
//       "name": "VoteCast",
//       "type": "event"
//     },
//     {
//       "inputs": [],
//       "name": "admin",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "candidateVotes",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "candidateId",
//           "type": "uint256"
//         }
//       ],
//       "name": "castVote",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "voter",
//           "type": "address"
//         }
//       ],
//       "name": "checkVoterStatus",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "candidateId",
//           "type": "uint256"
//         }
//       ],
//       "name": "getVotes",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "hasVoted",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "voter",
//           "type": "address"
//         }
//       ],
//       "name": "issueToken",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "issuedTokens",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "totalVotes",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ];

//   useEffect(() => {
//     const loadBlockchainData = async () => {
//       const ethProvider = await detectEthereumProvider();
//       if (ethProvider) {
//         const ethersProvider = new ethers.providers.Web3Provider(ethProvider);
//         const signer = ethersProvider.getSigner();
//         const votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
//         try {
//           const adminAddress = await votingContract.admin();
//           setAdmin(adminAddress);
//         } catch (err) {
//           console.error("Error fetching admin:", err);
//         }
//       } else {
//         console.log("Please install MetaMask!");
//       }
//     };
  
//     loadBlockchainData();
//   }, []);
  

//   const issueToken = async (voterAddress) => {
//     try {
//       await contract.issueToken(voterAddress);
//       alert("Token issued successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to issue token");
//     }
//   };

//   const castVote = async (candidateId) => {
//     try {
//       await contract.castVote(candidateId);
//       alert("Vote cast successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to cast vote");
//     }
//   };
  

//   return (
//     <div>
//       <h1>Voting System</h1>
//       <p>Admin: {admin}</p>
//       <p>Your Account: {account}</p>

//       {account === admin ? (
//         <div>
//           <h2>Issue Token to Voter</h2>
//           <input
//             type="text"
//             placeholder="Voter Address"
//             id="voterAddress"
//           />
//           <button
//             onClick={() =>
//               issueToken(document.getElementById("voterAddress").value)
//             }
//           >
//             Issue Token
//           </button>
//         </div>
//       ) : null}

//       <div>
//         <h2>Cast Your Vote</h2>
//         <button onClick={() => castVote(1)}>CPIM</button>
//         <button onClick={() => castVote(2)}>BJP</button>
//       </div>

//       <div>
//         <h2>Vote Counts</h2>
//         <p>CPIM: {voteCounts[0]}</p>
//         <p>BJP: {voteCounts[1]}</p>
//         <p>Total Votes: {totalVotes}</p>
//       </div>
//     </div>
//   );
// };

// export default VotingSystem;
