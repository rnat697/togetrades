import "./DexImage.css";

export function DexImage({ imageSrc }) {
  return (
    <div className="dex-img-container">
      <img src={imageSrc} />
    </div>
  );
}
