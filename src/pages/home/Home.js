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
// import TransactionOperations from "./TransactionOperations";
import TransactionList from "./TransactionList";
import AccountBalance from "./AccountBalance";

export default function Home() {
  const { user } = useAuthContext();
  const { mode } = useTheme();
  const { documents, error } = useCollection("transactions", [
    "uid",
    "==",
    user.uid,
  ]);

  // let { documents, error } = useCollection("users", ["uid", "==", user.uid]);

  return (
    <div className={`home ${mode}`}>
      <h1>Welcome to TheBank, {user.displayName}!</h1>
      <AccountBalance user={user} transactions={documents} />
      <div className="container">
        <div className="list">
          {error && <p>{error}</p>}
          {documents && <TransactionList transactions={documents} />}
          {/* <h3>Transaction List</h3> */}
        </div>
        <div className="sidebar">
          <TransferMoney
            uid={user.uid}
            displayName={user.displayName}
            email={user.email}
          />
          <RequestLoan uid={user.uid} displayName={user.displayName} />
          <DeleteAccount uid={user.uid} displayName={user.displayName} />
        </div>
      </div>
    </div>
  );
}
