import ABI from "../contracts/TradingCardGame.json";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { ethers } from "ethers";

import Web3Modal from "web3modal";
import { createEventListener } from "./createEventListener";
import { GetParams } from "../utils/onboard";

const ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const GlobalContext = createContext();
const WalletContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [contract, setContract] = useState("");
  const [battleName, setBattleName] = useState("");
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });
  const [updateGameData, setUpdateGameData] = useState(0);
  const [battleGround, setBattleGround] = useState("bg-astral");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const player1Ref = useRef();
  const player2Ref = useRef();

  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
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
          ADDRESS,
          ABI.abi,
          web3Signer
        );
        setContract(contractInstance);
        return { success: true, account: accounts };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: "No provider available" };
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

  useEffect(() => {
    const battleGroundFromLocalStorage = localStorage.getItem("battleground");

    if (battleGroundFromLocalStorage) {
      setBattleGround(battleGroundFromLocalStorage);
    } else {
      localStorage.setItem("battleground", battleGround);
    }
  });

  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams();
      setStep(currentStep.step);
    };
    resetParams();

    window?.ethereum?.on("chainChanged", () => resetParams());
    window?.ethereum?.on("accountsChanged", () => resetParams());
  });

  const updateCurrentWalletAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts) setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    updateCurrentWalletAddress();

    window.ethereum.on("accountsChanged", updateCurrentWalletAddress);
  }, []);

  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3Modal = new Web3Modal();

      const connection = await web3Modal.connect();

      const newProvider = new ethers.providers.Web3Provider(connection);

      const signer = newProvider.getSigner();

      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(newProvider);
      setContract(newContract);
    };
    setSmartContractAndProvider();
  }, []);

  useEffect(() => {
    if (step !== -1 && contract) {
      createEventListener({
        navigate,
        contract,
        provider,
        walletAddress,
        setShowAlert,
        setUpdateGameData,
        player1Ref,
        player2Ref,
      });
    }
  }, [contract, step]);

  useEffect(() => {
    const fetchGameData = async () => {
      const fetchedBattles = await contract.getAllBattles();
      console.log(fetchedBattles);
      const pendingBattles = fetchedBattles.filter(
        (battle) => battle.battleStatus === 0
      );
      let activeBattle = null;

      fetchedBattles.forEach((battle) => {
        if (
          battle.players.find(
            (player) => player.toLowerCase() === walletAddress.toLowerCase()
          )
        ) {
          if (battle.winner.startsWith("0x00")) {
            activeBattle = battle;
          }
        }
      });
      setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
    };

    if (contract) fetchGameData();
  }, [contract, updateGameData]);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: "info", message: "" });
      }, [5000]);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    if (errorMessage) {
      const parsedMessage = errorMessage?.reason
        ?.slice("execution reverted: ".length)
        .slice(0, -1);
      if (parsedMessage) {
        setShowAlert({
          status: true,
          type: "failure",
          message: parsedMessage,
        });
      }
    }
  }, [errorMessage]);

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        battleGround,
        setBattleGround,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref,
        updateCurrentWalletAddress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
