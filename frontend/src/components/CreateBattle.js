import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, Heading, Button, Input, useToast, Container } from '@chakra-ui/react';
import { useWallet } from '../WalletContext';

function CreateBattle() {
  const { account, contract } = useWallet();
  const [battleId, setBattleId] = useState('');
  const [playerCardId, setPlayerCardId] = useState('');
  const [computerCardId, setComputerCardId] = useState('');
  const [playerStatValue, setPlayerStatValue] = useState('');
  const [computerStatValue, setComputerStatValue] = useState('');
  const [waitBattle, setWaitBattle] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!battleId || !playerCardId || !computerCardId || !playerStatValue || !computerStatValue) {
      toast({
        title: 'Error',
        description: 'All fields must be filled out',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const battleIdNum = parseInt(battleId);
      const playerCardIdNum = parseInt(playerCardId);
      const computerCardIdNum = parseInt(computerCardId);
      const playerStatValueNum = parseInt(playerStatValue);
      const computerStatValueNum = parseInt(computerStatValue);

      const tx = await contract.createBattle(
        battleIdNum,
        playerCardIdNum,
        computerCardIdNum,
        playerStatValueNum,
        computerStatValueNum,
        { gasLimit: 200000 }
      );
      await tx.wait();
      setWaitBattle(true);

      toast({
        title: 'Battle Created',
        description: `Battle with ID ${battleIdNum} created successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate(`/battle/${battleIdNum}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {waitBattle && <div>Loading...</div>}
      <Container>
        <VStack spacing={4} mt={8} textAlign="center">
          <Heading as="h2" size="md">Create a New Battle</Heading>
          <Input
            placeholder="Enter Battle ID"
            value={battleId}
            onChange={(e) => setBattleId(e.target.value)}
          />
          <Input
            placeholder="Enter Player Card ID"
            value={playerCardId}
            onChange={(e) => setPlayerCardId(e.target.value)}
          />
          <Input
            placeholder="Enter Computer Card ID"
            value={computerCardId}
            onChange={(e) => setComputerCardId(e.target.value)}
          />
          <Input
            placeholder="Enter Player Stat Value"
            value={playerStatValue}
            onChange={(e) => setPlayerStatValue(e.target.value)}
          />
          <Input
            placeholder="Enter Computer Stat Value"
            value={computerStatValue}
            onChange={(e) => setComputerStatValue(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleClick}>Create Battle</Button>
          <Button variant="link" onClick={() => navigate('/join-battle')}>
            Or join an existing Battle
          </Button>
        </VStack>
      </Container>
    </>
  );
}

export default CreateBattle;
