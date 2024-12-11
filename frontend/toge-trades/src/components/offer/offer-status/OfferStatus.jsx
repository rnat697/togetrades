import styles from "./OfferStatus.module.css";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FiClock } from "react-icons/fi";
import { IoIosRemoveCircleOutline } from "react-icons/io";

export default function OfferStatus({ status }) {
  const statusColor = styles[`${status}`];
  const icons = {
    Pending: <FiClock size={20} color="#000" />,
    Accepted: <IoIosCheckmarkCircleOutline size={20} />,
    Declined: <IoIosRemoveCircleOutline size={20} />,
  };

  return (
    <div className={`${styles["offer-status-container"]} ${statusColor}`}>
      {icons[status]}
      <p>{status}</p>
    </div>
  );
}
