// styles
import "./Home.css";

import React, { useState } from "react";

export default function TransactionOperations() {
  const [trasnferTo, setTrasnferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleTransfer = (e) => {
    e.preventDefault();
    console.log(trasnferTo, transferAmount);
  };

  const handleRequestLoan = (e) => {
    e.preventDefault();
    console.log(loanAmount);
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    console.log(confirmEmail, confirmPassword);
  };

  return (
    <>
      {/* TRANSFER MONEY */}
      <div className="money">
        <h3>Transfer money</h3>
        <form onSubmit={handleTransfer}>
          <label>
            <span>Transfer to:</span>
            <input
              type="email"
              onChange={(e) => setTrasnferTo(e.target.value)}
              value={trasnferTo}
            />
          </label>
          <label>
            <span>Amount $:</span>
            <input
              type="text"
              onChange={(e) => setTransferAmount(e.target.value)}
              value={transferAmount}
            />
          </label>
          <button className="btn">Transfer</button>
        </form>
      </div>

      {/* REQUEST LOAN */}
      <div className="loan" onSubmit={handleRequestLoan}>
        <h3>Request loan</h3>
        <form>
          <label>
            <span>Amount $:</span>
            <input
              type="number"
              onChange={(e) => setLoanAmount(e.target.value)}
              value={loanAmount}
            />
          </label>
          <button className="btn">Request</button>
        </form>
      </div>

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
