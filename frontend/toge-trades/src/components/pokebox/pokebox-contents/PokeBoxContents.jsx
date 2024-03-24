import "./PokeBoxContents.css";
import { useState } from "react";
import SearchBar from "../search-bar/SearchBar";
import PokeBoxCards from "../pokebox-cards/PokeBoxCards";

export default function PokeBoxContents() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="box-content-container">
      <div className="pokebox-title">
        <h1>Poke Box</h1>
      </div>
      <div className="pokebox-search">
        <SearchBar
          placeholder={"Search for your Pokemon..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="pokebox-cards">
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
        <PokeBoxCards />
      </div>
    </div>
  );
}
