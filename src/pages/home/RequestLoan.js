// styles
import "./Home.css";

import React, { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useTheme } from "../../hooks/useTheme";

// Icon
import helpIcon from "../../assets/help.svg";

// Tippy
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function RequestLoan({ uid, displayName }) {
  const [loanAmount, setLoanAmount] = useState("");

  const { documents: users, error } = useCollection("users");
  const { updateDocument, response: updateDocRes } = useFirestore("users");
  const { user } = useAuthContext();
  const { mode } = useTheme();
  const { addDocument, response } = useFirestore("transactions");

  const handleRequestLoan = (e) => {
    e.preventDefault();

    // Logged in user's balance
    const userLoggedIn = users.filter((u) => u.uid === user.uid);
    const userBal = userLoggedIn[0].balance;
    console.log(userBal);

    const loanObj = { loanAmount, uid, displayName };

    if (loanObj.loanAmount <= 0.1 * userBal && loanObj.loanAmount > 0) {
      addDocument(loanObj);
    } else {
      throw new Error();
    }

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
      <div className={`loan ${mode}`}>
        <h3>
          Request Loan{" "}
          <Tippy content="Request loan to logged in user's account">
            <img src={helpIcon} alt="help icon" />
          </Tippy>
        </h3>
        <form onSubmit={handleRequestLoan}>
          <label>
            <span>
              Amount $:
              <Tippy content="Enter loan amount. Entered amount should be less than 10% of the logged in user's account balance">
                <img src={helpIcon} alt="help icon" />
              </Tippy>
            </span>
            <input
              type="number"
              required
              placeholder="e.g. 200"
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
