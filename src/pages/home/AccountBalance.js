// styles
import "./Home.css";
import React from "react";

import { useCollection } from "../../hooks/useCollection";

export default function AccountBalance({ user }) {
  const { documents: users, error } = useCollection("users", [
    "uid",
    "==",
    user.uid,
  ]);

  return (
    <div className="account-balance">
      {error && <p>{error}</p>}
      {users &&
        users.map((user) => (
          <div key={user.id} className="balance-container">
            <p className="title">Account Balance:</p>
            <p className="amount">${user.balance}</p>
          </div>
        ))}
    </div>
  );
}
