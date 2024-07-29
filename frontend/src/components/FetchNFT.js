import React, { useState } from 'react';
import { ethers } from 'ethers';
import CoreNFTABI from '../contracts/CoreNFT.json'

const contractAddress = '0x238d43c23CFc5d5dE4d691fFd881492E14Bcfa4A';

const FetchNFT = () => {
  const [tokenId, setTokenId] = useState('');
  const [nftData, setNftData] = useState(null);
  const [error, setError] = useState(null);

  const fetchNFTData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CoreNFTABI.abi, signer);

      const uri = await contract.tokenURI(tokenId);
      const response = await fetch(uri);
      const metadata = await response.json();

      setNftData(metadata);
      setError(null);
    } catch (err) {
      setError('Error fetching NFT data');
      console.error(err);
    }
  };

  const handleTokenIdChange = (e) => {
    setTokenId(e.target.value);
  };

  return (
    <div>
      <h1>Fetch NFT Data</h1>
      <input
        type="number"
        value={tokenId}
        onChange={handleTokenIdChange}
        placeholder="Enter Token ID"
      />
      <button onClick={fetchNFTData}>Fetch NFT</button>
      {nftData && (
        <div>
          <h2>NFT Data:</h2>
          <img src={nftData.image} alt={nftData.name} style={{ width: '300px', height: '300px' }} />
          <p><strong>Name:</strong> {nftData.name}</p>
          <p><strong>Description:</strong> {nftData.description}</p>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default FetchNFT;
