import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import PageLayout from "./Pages/page-layout/PageLayout.jsx";
import LandingPage from "./Pages/Landing/LandingPage.jsx";
import AuthorisationPage from "./Pages/Authorisation/AuthorisationPage.jsx";
import { RequiresAuth, RequiresNonAuth } from "./api/auth.jsx";
import PokeBoxPage from "./Pages/Pokebox/PokeBoxPage.jsx";
import IncubatorPage from "./Pages/Incubator/IncubatorPage.jsx";
import EggPickerPage from "./Pages/EggPicker/EggPickerPage.jsx";
import PokedexPage from "./Pages/Pokedex/PokedexPage.jsx";
import PokedexSpeciesPage from "./Pages/Pokedex-species/PokedexSpeciesPage.jsx";
import TradeHubPage from "./Pages/Trade-hub/TradeHubPage.jsx";
import ListingPage from "./Pages/listing/ListingPage.jsx";
import OutgoingOffersPage from "./Pages/outgoing-offers/OutgoingOffersPage.jsx";
import IncomingOffersPage from "./Pages/incoming-offers/IncomingOffersPage.jsx";

function App() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "Toge Trades",
      "/landing": "Toge Trades",
      "/login": "Login | Toge Trades",
      "/signup": "Signup | Toge Trades",
      "/incubator": "Incubator | TogeTrades",
      "/incubator/egg-picker": "Egg Picker | Toge Trades",
      "/tradehub": "Trade Hub | Toge Trades",
    };
    if (
      !location.pathname.startsWith("/pokedex/") ||
      !location.pathname.startsWith("/pokebox/")
    )
      document.title = titles[location.pathname] || "Toge Trades";
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route path="*" element={<Navigate to="/landing" replace />} />
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
          path="pokebox/:page?"
          element={
            <RequiresAuth>
              <PokeBoxPage />
            </RequiresAuth>
          }
        />
        <Route path="pokebox" element={<Navigate to="/pokebox/1" replace />} />
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
        <Route
          path="pokedex/:page?"
          element={
            <RequiresAuth>
              <PokedexPage />
            </RequiresAuth>
          }
        />
        <Route path="pokedex" element={<Navigate to="/pokedex/1" replace />} />
        <Route
          path="pokedex/entry/:dexNumber"
          element={
            <RequiresAuth>
              <PokedexSpeciesPage />
            </RequiresAuth>
          }
        />
        <Route element={<Navigate to="/pokedex/entry/1" replace />} />
        <Route
          path="tradehub/:page?"
          element={
            <RequiresAuth>
              <TradeHubPage />
            </RequiresAuth>
          }
        />
        <Route
          path="tradehub/listing/:id"
          element={
            <RequiresAuth>
              <ListingPage />
            </RequiresAuth>
          }
        />
        <Route
          path="tradehub/outgoing-offers/:page?"
          element={
            <RequiresAuth>
              <OutgoingOffersPage />
            </RequiresAuth>
          }
        />
        <Route
          path="tradehub/incoming-offers/:page?"
          element={
            <RequiresAuth>
              <IncomingOffersPage />
            </RequiresAuth>
          }
        />

        <Route
          path="tradehub"
          element={<Navigate to="/tradehub/1" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
