// styles
import "./ErrorModal.css";

import { useTheme } from "../hooks/useTheme";
import IconCancel from "../assets/cancel.svg";
import React from "react";

export default function ErrorModal({ title, message, errHandler }) {
  const { mode } = useTheme();
  return (
    <div className="error-modal-backdrop" onClick={errHandler}>
      <div className={`error-modal ${mode}`}>
        <header>
          <h2>
            {title}{" "}
            <img src={IconCancel} alt="cancel icon" onClick={errHandler} />
          </h2>
        </header>
        <div>
          <p>{message}</p>
        </div>
        <footer>
          <button className="bttn" onClick={errHandler}>
            OK
          </button>
        </footer>
      </div>
    </div>
  );
}
