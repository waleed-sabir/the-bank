// styles
import "./Home.css";

import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import TransactionOperations from "./TransactionOperations";
import TransactionList from "./TransactionList";

export default function Home() {
  const { user } = useAuthContext();
  const { documents, error } = useCollection("transactions", [
    "uid",
    "==",
    user.uid,
  ]);

  return (
    <div className="home">
      <h1>Welcome to theBank, {user.displayName}!</h1>
      <div className="container">
        <div className="list">
          {error && <p>{error}</p>}
          {documents && <TransactionList transactions={documents} />}
          {/* <h3>Transaction List</h3> */}
        </div>
        <div className="sidebar">
          <TransactionOperations
            uid={user.uid}
            displayName={user.displayName}
          />
        </div>
      </div>
    </div>
  );
}
