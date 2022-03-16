import { useTheme } from "../hooks/useTheme";
import "./Modal.css";

export default function Modal({ children }) {
  const { mode } = useTheme();
  return (
    <div className="modal-backdrop">
      <div className={`modal ${mode}`}>
        {/* <h2>10% Off Coupon Code!!</h2>
        <p>Use the code NINJA10 at the checkout.</p> */}

        {children}
      </div>
    </div>
  );
}
