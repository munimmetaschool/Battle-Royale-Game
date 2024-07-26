import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import TradingCardGame from './contracts/TradingCardGame.json';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
      }
    };

    initProvider();
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Signer = await provider.getSigner();
        const accounts = await web3Signer.getAddress();
        setAccount(accounts);
        setSigner(web3Signer);
        
        const contractInstance = new ethers.Contract(
          TradingCardGame.address,
          TradingCardGame.abi,
          web3Signer
        );
        setContract(contractInstance);
        
        return { success: true, account: accounts };
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

  const value = {
    account,
    provider,
    signer,
    contract,
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
