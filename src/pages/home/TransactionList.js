// styles
import "./Home.css";
import React from "react";
import { useFirestore } from "../../hooks/useFirestore";

export default function TransactionList({ transactions }) {
  const { deleteDocument, response } = useFirestore("transactions");
  console.log(response);
  return (
    <ul className="transactions">
      {transactions.map((transaction) => (
        <li
          key={transaction.id}
          style={{
            borderLeft: transaction.loanAmount
              ? "4px solid #1f9751"
              : "4px solid #ff0000",
          }}
        >
          <p className="name">{transaction.displayName}</p>
          <p
            className="amount"
            style={{ color: transaction.loanAmount ? "#1f9751" : "#ff0000" }}
          >
            ${transaction.loanAmount || transaction.transferAmount}
          </p>
          <button onClick={() => deleteDocument(transaction.id)}>x</button>
        </li>
      ))}
    </ul>
  );
}
