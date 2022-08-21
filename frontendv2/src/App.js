import './App.css';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyFiles from './components/MyFiles';
import SharedFiles from './components/SharedFiles';
import { Box, Button } from '@mui/material';
import MySharedFiles from './components/mySharedFilesComponents/MySharedFiles';
import { useEffect, useState } from 'react';
import Web3storage from './lib/web3storage';

// import { ByteArray, Bytes } from '@graphprotocol/graph-ts';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const THE_GRAPH_HOSTED_SERVICE_END_POINT = 'https://api.thegraph.com/subgraphs/name/hashharan/sovereignity';

function App() {

  const [provider, setProvider] = useState();
  const [owner, setOwner] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [web3storage, setWeb3storage] = useState();

  const setStuffBasedOnWallet = (provider, owner) => {
    setProvider(provider);
    setOwner(owner);
    setWeb3storage(new Web3storage(provider, setUploadProgress));
  }

  useEffect(() => {
    console.log(provider);
    console.log(owner);
    console.log(web3storage);
  });

  const cache = new InMemoryCache({
    typePolicies: { // Type policy map
      Content: {
        fields: { // Field policy map for the Content type
          web3StotrageStatus: { // Field policy for the web3StotrageStatus field
            read(web3StotrageStatus, { variables }) { // The read function for the isInCart field
              return web3storage.getStatus(variables.contentId);
            }
          }
        }
      }
    }
  });
  
  const client = new ApolloClient({
    uri: THE_GRAPH_HOSTED_SERVICE_END_POINT,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <NavigationBar setStuffBasedOnWallet={setStuffBasedOnWallet} />
          <Box sx={{ height: '150px' }} />
          <Routes>
            <Route path='/' element={<MyFiles provider={provider} owner={owner} uploadProgress={uploadProgress} web3storage={web3storage} />} />
            <Route path='/shared' element={<SharedFiles />} />
            <Route path='/mySharedFiles/:cid' element={<MySharedFiles />} />
          </Routes>
        </Router>
      </div >
    </ApolloProvider>
  );
}

export default App;
