// styles
import "./Home.css";

import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useTheme } from "../../hooks/useTheme";

// page components
import TransferMoney from "./TransferMoney";
import RequestLoan from "./RequestLoan";
import DeleteAccount from "./DeleteAccount";
import TransactionList from "./TransactionList";
import AccountBalance from "./AccountBalance";

export default function Home() {
  const { user } = useAuthContext();
  const { mode, color } = useTheme();
  const { documents, error } = useCollection("transactions", [
    "uid",
    "==",
    user.uid,
  ]);

  return (
    <div className={`home ${mode}`}>
      <h1>
        Welcome to TheBank,{" "}
        <span style={{ color: color }}>{user.displayName}</span>!
      </h1>
      <AccountBalance user={user} transactions={documents} />
      <div className="container">
        <div className="list">
          {error && <p>{error}</p>}
          {documents && <TransactionList transactions={documents} />}
        </div>
        <div className="sidebar">
          <TransferMoney
            uid={user.uid}
            displayName={user.displayName}
            email={user.email}
          />
          <p className="default-user">
            <strong style={{ color: color }}>NOTE: </strong>
            For testing the Transfer Money feature, the user can use{" "}
            <strong style={{ color: color }}>mario@thebank.org</strong> as the
            recipient's email address (already existing user in the database).
          </p>
          <RequestLoan uid={user.uid} displayName={user.displayName} />
          <DeleteAccount uid={user.uid} displayName={user.displayName} />
          <p className="del-anonymous">
            <strong style={{ color: color }}>NOTE: </strong> Close Account
            feature does not work for{" "}
            <strong style={{ color: color }}> 'anonymous users'</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
