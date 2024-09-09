import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AdminPage from './components/AdminPage';
import VotingPage from './components/VotingPage';
import './App.css';

function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <Routes>
    //       <Route path="/admin" element={<AdminPage />} />
    //       <Route path="/vote" element={<VotingPage />} />
    //     </Routes>
    //   </div>
    // </Router>
    <div>
      <VotingPage />
    </div>
  );
}

export default App;
