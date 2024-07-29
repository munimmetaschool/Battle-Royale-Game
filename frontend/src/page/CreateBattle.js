// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useWallet } from "../WalletContext";
// import FetchNFT from "../components/FetchNFT";
// import CustomButton from "../components/CustomButton";
// import CustomInput from "../components/CustomInput";
// import styles from "../styles";
// import { ethers } from "ethers";
// import CoreNFTABI from "../contracts/CoreNFT.json";

// // Replace with your Core NFT contract address
// const CORE_NFT_CONTRACT_ADDRESS = "0x238d43c23CFc5d5dE4d691fFd881492E14Bcfa4A";

// const CreateBattle = () => {
//   const { contract } = useWallet(); // Access the TradingCardGame contract from WalletContext
//   const [battleName, setBattleName] = useState("");
//   const [playerNFTs, setPlayerNFTs] = useState([]);
//   const [selectedNFT, setSelectedNFT] = useState(null);
//   const [waitBattle, setWaitBattle] = useState(false);
//   const navigate = useNavigate();

//   // Fetch player's NFTs
//   const fetchPlayerNFTs = async () => {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const nftContract = new ethers.Contract(
//         CORE_NFT_CONTRACT_ADDRESS,
//         CoreNFTABI.abi,
//         provider
//       );
//       const accounts = await provider.send("eth_requestAccounts", []);
//       const ownerAddress = accounts[0];

//       // Fetch the balance of NFTs owned by the user
//       const balance = await nftContract.balanceOf(ownerAddress);
//       const tokenIds = [];
//       for (let i = 0; i < balance.toNumber(); i++) {
//         const tokenId = await nftContract.getApproved(i); // Assuming you have a method to get the token IDs
//         tokenIds.push(tokenId);
//       }

//       // Fetch metadata for each token ID
//       const nftData = await Promise.all(
//         tokenIds.map(async (id) => {
//           const uri = await nftContract.tokenURI(id); // Assuming tokenURI returns the metadata URI
//           const response = await fetch(uri);
//           return response.json();
//         })
//       );
//       setPlayerNFTs(nftData);
//     } catch (error) {
//       console.error("Error fetching NFTs:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPlayerNFTs();
//   }, []);

//   const handleClick = async () => {
//     if (!battleName || !battleName.trim() || !selectedNFT) return;

//     try {
//       // Use random values for player and computer cards and stats
//       const playerCardId = selectedNFT.id;
//       const computerCardId = Math.floor(Math.random() * 1000); // Random value for demonstration
//       const playerStatValue = Math.floor(Math.random() * 100); // Random stat value for demonstration
//       const computerStatValue = Math.floor(Math.random() * 100); // Random stat value for demonstration
//       const battleId = Math.floor(Math.random() * 10000); // Random battle ID for demonstration

//       await contract.createBattle(
//         battleId,
//         playerCardId,
//         computerCardId,
//         playerStatValue,
//         computerStatValue,
//         { gasLimit: 200000 }
//       );
//       setWaitBattle(true);
//     } catch (error) {
//       console.error("Error creating battle:", error);
//     }
//   };

//   return (
//     <>
//       {/* {waitBattle && <GameLoad />} */}
//       <div className="flex flex-col mb-5">
//         <CustomInput
//           label="Battle Name"
//           placeholder="Enter battle name"
//           value={battleName}
//           handleValueChange={setBattleName}
//         />
//         {playerNFTs.length > 0 && (
//           <div>
//             <h2>Select Your NFT</h2>
//             {playerNFTs.map((nft) => (
//               <div key={nft.id} onClick={() => setSelectedNFT(nft)}>
//                 <img
//                   src={nft.image}
//                   alt={nft.name}
//                   style={{ width: "100px", height: "100px" }}
//                 />
//                 <p>{nft.name}</p>
//               </div>
//             ))}
//           </div>
//         )}
//         <CustomButton
//           title="Create Battle"
//           handleClick={handleClick}
//           restStyles="mt-6"
//         />
//       </div>
//       <p className={styles.infoText} onClick={() => navigate("/join-battle")}>
//         Or join an already existing Battle
//       </p>
//     </>
//   );
// };

// export default CreateBattle;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles";

import { useGlobalContext } from "../context";
import { PageHOC, CustomButton, CustomInput, GameLoad } from "../components";
const CreateBattle = () => {
  const { contract, battleName, setBattleName, gameData, setErrorMessage } =
    useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameData?.activeBattle?.battleName === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
    if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData]);

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) return null;
    //contract call
    try {
      await contract.createBattle(battleName, { gasLimit: 200000 });
      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error);
    }
  };
  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>
      <p
        className={styles.infoText}
        onClick={() => {
          navigate("/join-battle");
        }}
      >
        Or join already existing Battle
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create
    <br /> a new battle
  </>,
  <>Create your own battle and wait for other players to join</>
);

