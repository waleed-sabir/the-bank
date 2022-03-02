// styles
import "./Home.css";

import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import TransactionOperations from "./TransactionOperations";

export default function Home() {
  const { user } = useAuthContext();

  return (
    <div className="home">
      <h1>Welcome to theBank, {user.displayName}!</h1>
      <div className="container">
        <div className="list">
          <h3>Transaction List</h3>
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
