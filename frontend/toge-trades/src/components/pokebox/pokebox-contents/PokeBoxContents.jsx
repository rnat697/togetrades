import "./PokeBoxContents.css";
import { useState, useEffect, useRef } from "react";
import SearchBar from "../search-bar/SearchBar";
import PokeBoxCards from "../pokebox-cards/PokeBoxCards";
import { pokemonByUser } from "../../../api/api";
import { useAuth } from "../../../api/auth";

export default function PokeBoxContents() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

  // Fetch Pokemon data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await pokemonByUser(user._id, {
        page: page,
        limit: 12,
      });
      const data = response.data;
      setPokemonList((prevList) => [...prevList, ...data]);
      setLoading(false);
    };
    fetchData();
  }, [page]);

  // Fetch data when page or searchQuery changes
  useEffect(() => {
    setPokemonList([]);
    setPage(1);
  }, [searchQuery]);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    containerRef.current.addEventListener("scroll", handleScroll);
    return () => {
      containerRef.current.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <div className="pokebox-cards" ref={containerRef}>
        {pokemonList.map((pokemon, index) => (
          <PokeBoxCards key={index} pokemon={pokemon} />
        ))}
        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
}
