import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PageLayout from './components/page-layout/PageLayout.jsx';
import LandingPage from './Pages/Landing/LandingPage.jsx';
import AuthorisationPage from "./Pages/Authorisation/AuthorisationPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Navigate to="landing" replace />} />
        <Route path="landing" element={<LandingPage />} />
        <Route path="login" element={<AuthorisationPage isLogin={true} />} />
        <Route path="signup" element={<AuthorisationPage isLogin={false} />} />
      </Route>
    </Routes>
  );
}

export default App
