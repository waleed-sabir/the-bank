// styles
import "./Home.css";

import React, { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useTheme } from "../../hooks/useTheme";

// Icon
import helpIcon from "../../assets/help.svg";
import closeIcon from "../../assets/close.svg";

// Tippy
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

// page components
import Modal from "../../components/Modal";
import ErrorModal from "../../components/ErrorModal";

export default function RequestLoan({ uid, displayName }) {
  const [loanAmount, setLoanAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [err, setErr] = useState(null);

  const { documents: users, error } = useCollection("users");
  const { updateDocument, response: updateDocRes } = useFirestore("users");
  const { user } = useAuthContext();
  const { mode, color } = useTheme();
  const { addDocument, response } = useFirestore("transactions");

  const handleRequestLoan = (e) => {
    e.preventDefault();

    // Logged in user's balance
    const userLoggedIn = users.filter((u) => u.uid === user.uid);
    const userBal = userLoggedIn[0].balance;
    console.log(userBal);

    const loanObj = { loanAmount, uid, displayName };

    if (
      loanObj.loanAmount <= 0.1 * userBal &&
      loanObj.loanAmount > 0 &&
      loanObj.loanAmount !== ""
    ) {
      addDocument(loanObj);
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
    const hideModal = (e) => {
      if (e.path[0].className === "modal-backdrop" || e.key === "Escape") {
        setShowModal(false);
      }
    };

    document.body.addEventListener("click", hideModal);
    document.body.addEventListener("keydown", hideModal);

    if (response.success) {
      setLoanAmount("");
      setShowModal(false);
    }

    return () => {
      document.body.removeEventListener("click", hideModal);
      document.body.removeEventListener("keydown", hideModal);
    };
  }, [response.success]);

  const errHandler = () => {
    setErr(null);
  };

  return (
    <>
      {/* REQUEST LOAN */}
      {err && (
        <ErrorModal
          title={err.title}
          message={err.message}
          errHandler={errHandler}
        />
      )}
      <div className={`loan ${mode}`}>
        <h3>
          Request Loan{" "}
          <Tippy content="Request loan to logged in user's account">
            <img src={helpIcon} alt="help icon" />
          </Tippy>
        </h3>
        <form>
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
          <button
            className="btn request"
            onClick={(e) => {
              e.preventDefault();
              const loggedInUsrBal = users.filter((u) => u.uid === user.uid)[0]
                .balance;
              console.log(loggedInUsrBal);
              if (
                loanAmount !== "" &&
                loanAmount <= 0.1 * loggedInUsrBal &&
                loanAmount > 0
              ) {
                setShowModal(true);
              } else {
                setErr({
                  title: "An error occured!",
                  message: "Please enter a correct loan amount.",
                });
              }
            }}
          >
            Request
          </button>
        </form>
        {showModal && (
          <Modal>
            <h2>
              Confirm action{" "}
              <img
                src={closeIcon}
                alt="close icon"
                onClick={() => setShowModal(false)}
              />
            </h2>
            <p>
              Are you sure to request a loan of{" "}
              <strong style={{ color: color }}>${loanAmount}</strong> from the
              bank?
            </p>
            <div className="butn-container">
              <button className="butn yes" onClick={handleRequestLoan}>
                YES
              </button>
              <button className="butn no" onClick={() => setShowModal(false)}>
                NO
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
