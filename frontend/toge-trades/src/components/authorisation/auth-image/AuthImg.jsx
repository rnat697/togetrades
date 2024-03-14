import "./AuthImg.css";

export default function AuthImage({ showLogin }) {
  return (
    <div className={`img-container ${showLogin ? "login" : "signup"}`}>
      <div className="auth-image">
        <img className="image" src="../src/assets/toge-evos.png" />
      </div>
      <h2 className="title">Gotta Hatch 'Em All!</h2>
    </div>
  );
}
