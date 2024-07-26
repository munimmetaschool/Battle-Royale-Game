import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { WalletProvider } from './WalletContext';
import Home from './components/Home';
import CreateBattle from './components/CreateBattle';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <ChakraProvider>
      <WalletProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-battle" element={<CreateBattle />} />
          </Routes>
        </Router>
      </WalletProvider>
    </ChakraProvider>
  );
}

export default App;
