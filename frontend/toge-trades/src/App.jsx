import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PageLayout from './components/page-layout/PageLayout.jsx';
import LandingPage from './Pages/Landing/LandingPage.jsx';
import AuthorisationPage from "./Pages/Authorisation/AuthorisationPage.jsx";
import { RequiresAuth, RequiresNonAuth } from "./api/auth.jsx";
import PokeBoxPage from "./Pages/Pokebox/PokeBoxPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Navigate to="landing" replace />} />
        <Route
          path="landing"
          element={
            <RequiresNonAuth>
              <LandingPage />
            </RequiresNonAuth>
          }
        />
        <Route
          path="login"
          element={
            <RequiresNonAuth>
              <AuthorisationPage isLogin={true} />
            </RequiresNonAuth>
          }
        />
        <Route
          path="signup"
          element={
            <RequiresNonAuth>
              <AuthorisationPage isLogin={false} />
            </RequiresNonAuth>
          }
        />

        <Route
          path="pokebox"
          element={
            <RequiresAuth>
              <PokeBoxPage />
            </RequiresAuth>
          }
        />
      </Route>
    </Routes>
  );
}

export default App
