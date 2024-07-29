import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { useGlobalContext } from "./context/WalletContext";
import Home from './page/Home';
import CreateBattle from './page/CreateBattle';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <ChakraProvider>
      <useGlobalContext>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-battle" element={<CreateBattle />} />
          </Routes>
        </Router>
      </useGlobalContext>
    </ChakraProvider>
  );
}

export default App;
