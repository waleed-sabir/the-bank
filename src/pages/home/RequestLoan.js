// styles
import "./Home.css";

import React, { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";

export default function RequestLoan({ uid, displayName }) {
  const [loanAmount, setLoanAmount] = useState("");

  const { documents: users, error } = useCollection("users");
  const { updateDocument, response: updateDocRes } = useFirestore("users");

  const { addDocument, response } = useFirestore("transactions");

  const handleRequestLoan = (e) => {
    e.preventDefault();

    const loanObj = { loanAmount, uid, displayName };
    addDocument(loanObj);

    //   updating balance of loan REQUESTER in 'users' collection
    const requesterDoc = users.filter((u) => u.uid === loanObj.uid);
    const requesterUpdatedBalance = requesterDoc[0].balance + +loanAmount;
    updateDocument(requesterDoc[0].id, {
      balance: requesterUpdatedBalance,
    });
    console.log(requesterUpdatedBalance);
  };

  useEffect(() => {
    if (response.success) {
      setLoanAmount("");
    }
  }, [response.success]);

  return (
    <>
      {/* REQUEST LOAN */}
      <div className="loan">
        <h3>Request loan</h3>
        <form onSubmit={handleRequestLoan}>
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
    </>
  );
}
