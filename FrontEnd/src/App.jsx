import React,{ useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DonationsList from './components/DonationsList';

function App() {
  return (
    <Router>
     <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/donationList" element={<DonationsList />}/>
      </Routes>
    </Router>
  )
}

export default App
