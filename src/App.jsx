import { useState } from 'react';
import './App.css';
import Home from './Pages/Home';
import { Routes, Route } from 'react-router-dom';
import Generator from './Pages/Generator';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/generator' element={<Generator />} />
    </Routes>
  )
}

export default App
