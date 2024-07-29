import React, { useState } from 'react';
import { ChakraProvider, Box, VStack, Heading, Button, Input, useToast, Flex, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../WalletContext';

function Home() {
  const { account, connectWallet, disconnectWallet, contract } = useWallet();
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const navigateHome = () => {
    navigate('/');
  };

  const handleWalletAction = async () => {
    if (account) {
      disconnectWallet();
      toast({
        title: 'Wallet Disconnected',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } else {
      const result = await connectWallet();
      if (result.success) {
        toast({
          title: 'Wallet Connected',
          description: `Connected to ${result.account}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: result.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleRegister = async () => {
    console.log("handleRegister")
    if (name.trim() === '') {
      toast({
        title: 'Registration Failed',
        description: 'Name cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!account) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to register',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const tx = await contract.registerPlayer(name);
      await tx.wait();

      toast({
        title: 'Registration Successful',
        description: `Welcome, ${name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      console.log("Player Registered")
      console.log(name)
      // Navigate to createBattle page
      navigate('/create-battle');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Flex direction="column" minHeight="100vh">
        <Flex align="center" justify="space-between" padding="1.5rem" bg="white" color="gray.600" boxShadow="sm">
          <Flex align="center" mr={5}>
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'} color="purple.600" onClick={navigateHome} cursor="pointer" _hover={{ color: "purple.500" }}>
              Battle Royale
            </Heading>
          </Flex>
          <Box>
            <Button
              colorScheme={account ? 'red' : 'green'}
              onClick={handleWalletAction}
            >
              {account ? 'Disconnect Wallet' : 'Connect Wallet'}
            </Button>
          </Box>
        </Flex>

        <Flex flex="1" justify="center" align="center" bg="gray.50">
          <Container>
            <VStack spacing={4} mt={8} textAlign="center">
              <Heading as="h2" size="md">Register for Battle Royale</Heading>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button 
                colorScheme="blue" 
                onClick={handleRegister}
                isDisabled={!account}
              >
                Register
              </Button>
              {!account && (
                <Box color="red.500">
                  Please connect your wallet to register.
                </Box>
              )}
            </VStack>
          </Container>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default Home;
