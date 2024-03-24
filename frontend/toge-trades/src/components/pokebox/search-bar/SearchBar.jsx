import "./SearchBar.css";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="search-bar-container">
      <div className="search-icon">
        <IoIosSearch size={"2em"} color="#7F869B" />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
