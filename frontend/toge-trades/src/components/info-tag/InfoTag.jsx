import "./InfoTag.css";

export default function InfoTag({ title, subtitle }) {
  return (
    <div className="infotag-container">
      <h3>{title}</h3>
      <div className="infotag-subtitle">
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
