import { useTheme } from "../hooks/useTheme";

import "./Modal.css";

export default function Modal({ children, modalRef }) {
  const { mode } = useTheme();

  return (
    <div className="modal-backdrop">
      <div className={`modal ${mode}`}>{children}</div>
    </div>
  );
}
