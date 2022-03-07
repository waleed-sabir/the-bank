// styles
import "./Home.css";

import React, { useState } from "react";

export default function DeleteAccount({ uid, displayName }) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    console.log({ confirmEmail, confirmPassword, uid, displayName });
  };

  return (
    <>
      {/* DELETE ACCOUNT */}
      <div className="close" onSubmit={handleDeleteAccount}>
        <h3>Close account</h3>
        <form>
          <label>
            <span>Confirm email:</span>
            <input
              type="email"
              onChange={(e) => setConfirmEmail(e.target.value)}
              value={confirmEmail}
            />
          </label>
          <label>
            <span>Confirm password:</span>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </label>
          <button className="btn">Delete</button>
        </form>
      </div>
    </>
  );
}
