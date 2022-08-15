import './App.css';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyFiles from './components/MyFiles';
import SharedFiles from './components/SharedFiles';
import { Box } from '@mui/material';
import MySharedFiles from './components/mySharedFilesComponents/MySharedFiles';

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Box sx={{ height: '150px' }} />
        <Routes>
          <Route path='/' element={<MyFiles />} />
          <Route path='/shared' element={<SharedFiles />} />
          <Route path='/mySharedFiles/:cid' element={<MySharedFiles />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
