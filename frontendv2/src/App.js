import './App.css';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyFiles from './components/MyFiles';
import SharedFiles from './components/SharedFiles';
import { Box, Button } from '@mui/material';
import MySharedFiles from './components/mySharedFilesComponents/MySharedFiles';
import { useState } from 'react';

function App() {

  const [provider, setProvider] = useState();

  // const printProvider = () => { console.log(provider) };

  return (
    <div className="App">
      <Router>
        <NavigationBar setProvider={setProvider} />
        <Box sx={{ height: '150px' }} />
        {/* <Button onClick={printProvider} variant='outlined'>Chumma Test</Button> */}
        <Routes>
          <Route path='/' element={<MyFiles provider={provider} />} />
          <Route path='/shared' element={<SharedFiles />} />
          <Route path='/mySharedFiles/:cid' element={<MySharedFiles />} />
        </Routes>
      </Router>
    </div >
  );
}

export default App;
