import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import TradingCardGame from '../contracts/TradingCardGame.json';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      }
    };

    initProvider();
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];
        console.log(account);
        setAccount(account);
        setSigner(signer);

        const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
        const contract = new ethers.Contract(contractAddress, TradingCardGame.abi, signer);
        setContract(contract);

        return { success: true, account };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'No provider available' };
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setContract(null);
  };

  console.log("Wallet Connected", account);

  const value = {
    account,
    provider,
    signer,
    contract, // Add contract to the context value
    connectWallet,
    disconnectWallet,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
