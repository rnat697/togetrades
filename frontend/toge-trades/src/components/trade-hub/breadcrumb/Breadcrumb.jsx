import { Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";
import { IoIosArrowForward } from "react-icons/io";

export default function Breadcrumb({ currentPageName }) {
  return (
    <div className={styles["breadcrumb"]}>
      <Link to="/tradehub" className={styles["breadcrumb-link"]}>
        Trade Hub
      </Link>
      <IoIosArrowForward />
      <span>{currentPageName}</span>
    </div>
  );
}
