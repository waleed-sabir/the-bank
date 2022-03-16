// styles
import "./Home.css";
import React from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import trashcan from "../../assets/trashcan.svg";
import { useTheme } from "../../hooks/useTheme";

export default function TransactionList({ transactions }) {
  const { user } = useAuthContext();
  const { color } = useTheme();
  const { deleteDocument, response } = useFirestore("transactions");
  console.log(transactions);

  if (transactions.length === 0) {
    return <h2 className="no-transactions">No transactions yet...</h2>;
  }

  return (
    <ul className="transactions">
      {transactions.map((transaction) => (
        <li
          key={transaction.id}
          style={{
            borderLeft: transaction.transferAmount
              ? "4px solid #ff0000"
              : "4px solid #1f9751",
          }}
        >
          <p className="name">
            {transaction.transferAmount ? "WITHDRAWL" : "DEPOSIT"}
          </p>
          <p
            className="amount"
            style={{
              color: transaction.transferAmount ? "#ff0000" : "#1f9751",
            }}
          >
            $
            {transaction.loanAmount ||
              transaction.transferAmount ||
              transaction.transferredAmount}
          </p>

          <img
            className="del-btn"
            src={trashcan}
            alt="Delete icon"
            onClick={() => deleteDocument(transaction.id)}
          />
        </li>
      ))}
    </ul>
  );
}
