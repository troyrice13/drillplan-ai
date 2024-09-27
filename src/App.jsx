import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Generator from './Pages/Generator';
import Header from './components/Header';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import Routines from './Pages/Routines';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/generator' element={
          <ProtectedRoute>
            <Generator />
          </ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path='/routines' element={
          <ProtectedRoute>
            <Routines />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App;