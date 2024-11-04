import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import PageLayout from "./Pages/page-layout/PageLayout.jsx";
import LandingPage from "./Pages/Landing/LandingPage.jsx";
import AuthorisationPage from "./Pages/Authorisation/AuthorisationPage.jsx";
import { RequiresAuth, RequiresNonAuth } from "./api/auth.jsx";
import PokeBoxPage from "./Pages/Pokebox/PokeBoxPage.jsx";
import IncubatorPage from "./Pages/Incubator/IncubatorPage.jsx";
import EggPickerPage from "./Pages/EggPicker/EggPickerPage.jsx";

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
        <Route
          path="incubator"
          element={
            <RequiresAuth>
              <IncubatorPage />
            </RequiresAuth>
          }
        />
        <Route
          path="incubator/egg-picker"
          element={
            <RequiresAuth>
              <EggPickerPage />
            </RequiresAuth>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
