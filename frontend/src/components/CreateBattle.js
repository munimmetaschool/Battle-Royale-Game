import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../WalletContext";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import styles from "../styles";

const CreateBattle = () => {
  const { contract, account } = useWallet(); // Get contract and account from WalletContext
  const [battleName, setBattleName] = useState("");
  const [waitBattle, setWaitBattle] = useState(false);
  const [playerCardId, setPlayerCardId] = useState(0);
  const [computerCardId, setComputerCardId] = useState(0);
  const [playerStatValue, setPlayerStatValue] = useState(0);
  const [computerStatValue, setComputerStatValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to battle page if an active battle is found
    const fetchActiveBattle = async () => {
      if (contract) {
        try {
          const battles = await contract.getAllBattles(); // Replace with your method to get battles
          const activeBattle = battles.find(
            (battle) => battle.players.includes(account.toLowerCase()) && battle.battleStatus === 0
          );
          if (activeBattle) {
            navigate(`/battle/${activeBattle.battleName}`);
            setWaitBattle(true);
          }
        } catch (error) {
          console.error("Error fetching active battles:", error);
        }
      }
    };
    fetchActiveBattle();
  }, [contract, account, navigate]);

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) {
      setErrorMessage("Battle name cannot be empty");
      return;
    }

    // Generate a unique battle ID
    const uniqueBattleId = Date.now(); // Simple method for generating unique IDs

    try {
      if (contract) {
        const tx = await contract.createBattle(
          uniqueBattleId,
          playerCardId,
          computerCardId,
          playerStatValue,
          computerStatValue,
          { gasLimit: 200000 }
        );
        await tx.wait(); // Wait for transaction to be mined
        setWaitBattle(true);
      } else {
        setErrorMessage("Contract is not initialized.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle Name"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />
        <CustomInput
          label="Player Card ID"
          placeholder="Enter player card ID"
          value={playerCardId}
          handleValueChange={(value) => setPlayerCardId(Number(value))}
        />
        <CustomInput
          label="Computer Card ID"
          placeholder="Enter computer card ID"
          value={computerCardId}
          handleValueChange={(value) => setComputerCardId(Number(value))}
        />
        <CustomInput
          label="Player Stat Value"
          placeholder="Enter player stat value"
          value={playerStatValue}
          handleValueChange={(value) => setPlayerStatValue(Number(value))}
        />
        <CustomInput
          label="Computer Stat Value"
          placeholder="Enter computer stat value"
          value={computerStatValue}
          handleValueChange={(value) => setComputerStatValue(Number(value))}
        />
        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
      </div>
      <p
        className={styles.infoText}
        onClick={() => {
          navigate("/join-battle");
        }}
      >
        Or join an already existing Battle
      </p>
    </>
  );
};

export default CreateBattle;
