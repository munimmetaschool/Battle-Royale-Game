import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CoreNFTABI from '../contracts/CoreNFT.json';  // Ensure this file contains the provided ABI

const contractAddress = '0x238d43c23CFc5d5dE4d691fFd881492E14Bcfa4A';

const FetchNFT = ({ onNFTSelect }) => {
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, CoreNFTABI.abi, signer);
        const address = await signer.getAddress();
        const balance = await contract.balanceOf(address);

        const nftData = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          const uri = await contract.tokenURI(tokenId);
          const response = await fetch(uri);
          const metadata = await response.json();
          nftData.push({ tokenId: tokenId.toString(), ...metadata });
        }

        setNfts(nftData);
        setError(null);
      } catch (err) {
        setError('Error fetching NFTs');
        console.error(err);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div>
      <h1>Your NFTs</h1>
      {nfts.length > 0 ? (
        <div>
          {nfts.map((nft, index) => (
            <div key={index} onClick={() => onNFTSelect(nft)}>
              <img src={nft.image} alt={nft.name} style={{ width: '100px', height: '100px' }} />
              <p><strong>Name:</strong> {nft.name}</p>
              <p><strong>Description:</strong> {nft.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No NFTs found</p>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default FetchNFT;
