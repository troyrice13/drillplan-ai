import { useState } from 'react';
import './App.css';
import Home from './Pages/Home';
import { Routes, Route } from 'react-router-dom';
import Generator from './Pages/Generator';
import Header from './components/Header';
import Login from './Pages/Login';


function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/generator' element={<Generator />} />
      <Route path='/login' element={<Login />} />
    </Routes>
    </>
  )
}

export default App
