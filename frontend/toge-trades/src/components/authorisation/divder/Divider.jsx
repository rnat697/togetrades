import "./Divider.css"; // Import CSS file for Divider styles

export default function Divider() {
  return (
    <div className="divider">
      <div className="line"></div>
      <span className="or">OR</span>
      <div className="line"></div>
    </div>
  );
}
