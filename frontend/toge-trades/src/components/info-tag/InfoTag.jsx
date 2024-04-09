import "./InfoTag.css";
// For height and weight tags
export default function InfoTag({ title, subtitle }) {
  return (
    <div className="infotag-container">
      <h3 className="infotag-title">{title}</h3>
      <div className="infotag-subtitle">
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
