import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PageLayout from './components/PageLayout.jsx';
import LandingPage from './Pages/Landing/LandingPage.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Navigate to="landing" replace />} />
        <Route path="landing" element={<LandingPage />} />

      </Route>
    </Routes>
  )
}

export default App
