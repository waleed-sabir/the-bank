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

// page components
import Modal from "../../components/Modal";
import ErrorModal from "../../components/ErrorModal";

// Tippy
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function TransferMoney({ uid, displayName, email }) {
  const [transferTo, setTrasnferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [err, setErr] = useState(null);

  const { documents: users } = useCollection("users");

  const { user } = useAuthContext();
  const { mode, color } = useTheme();

  const { addDocument, response } = useFirestore("transactions");
  const { updateDocument, response: updateDocRes } = useFirestore("users");

  const handleTransfer = (e) => {
    e.preventDefault();

    // Logged in user's balance
    const userLoggedIn = users.filter((u) => u.uid === user.uid);
    const userBal = userLoggedIn[0].balance;
    console.log(userBal);

    const transferObj = {
      transferTo,
      transferAmount,
      uid,
      displayName,
      transferredBy: email,
    };

    //   Receiver's email
    const receiver = users.filter(
      (usr) => usr.email === transferObj.transferTo
    );
    const receiverEmail = receiver[0].email;
    console.log(receiverEmail);

    if (
      transferObj.transferTo === receiverEmail &&
      transferObj.transferTo !== transferObj.transferredBy &&
      transferObj.transferAmount < 0.5 * userBal &&
      transferObj.transferAmount > 0
    ) {
      addDocument(transferObj);
    }

    //   updating balance of SENDER in 'users' collection
    const senderDoc = users.filter((u) => u.uid === transferObj.uid);
    const senderUpdatedBalance = senderDoc[0].balance - +transferAmount;
    updateDocument(senderDoc[0].id, {
      balance: senderUpdatedBalance,
    });
    console.log(senderDoc);

    //   updating balance of RECEIVER in 'users' collection
    const receiverDoc = users.filter(
      (u) =>
        u.email === transferObj.transferTo &&
        u.email !== transferObj.transferredBy
    );
    const receiverUpdatedBalance = receiverDoc[0].balance + +transferAmount;

    updateDocument(receiverDoc[0].id, {
      balance: receiverUpdatedBalance,
    });
    console.log(receiverDoc);

    //   adding the transferred amount in RECEIVER's 'transactions' collection
    const recvDoc = users.filter(
      (u) =>
        u.email === transferObj.transferTo &&
        u.email !== transferObj.transferredBy
    );
    const transferredAmount = +transferObj.transferAmount;
    console.log(recvDoc);

    const transferredAmountObj = {
      transferredAmount,
      displayName: recvDoc[0].displayName,
      uid: recvDoc[0].uid,
    };

    addDocument(transferredAmountObj);
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
      setTrasnferTo("");
      setTransferAmount("");
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
      {/* TRANSFER MONEY */}
      {err && (
        <ErrorModal
          title={err.title}
          message={err.message}
          errHandler={errHandler}
        />
      )}
      <div className={`money ${mode}`}>
        <h3>
          Transfer Money{" "}
          <Tippy content="Transfer money to other existing users' accounts">
            <img src={helpIcon} alt="help icon" />
          </Tippy>
        </h3>
        <form>
          <label>
            <span>
              Transfer to:
              <Tippy content="Enter recipient's email address">
                <img src={helpIcon} alt="help icon" />
              </Tippy>
            </span>
            <input
              required
              type="email"
              placeholder="e.g. mario@thebank.org"
              onChange={(e) => setTrasnferTo(e.target.value)}
              value={transferTo}
            />
          </label>
          <label>
            <span>
              Amount $:
              <Tippy content="Enter amount to be transferred. Entered amount should be less than 50% of the logged in user's account balance">
                <img src={helpIcon} alt="help icon" />
              </Tippy>
            </span>
            <input
              type="number"
              required
              placeholder="e.g. 100"
              onChange={(e) => setTransferAmount(e.target.value)}
              value={transferAmount}
            />
          </label>
          <button
            className="btn transfer"
            onClick={(e) => {
              e.preventDefault();

              console.log(transferTo);

              const loggedInUsrEmail = users.filter(
                (u) => u.uid === user.uid
              )[0].email;
              console.log(loggedInUsrEmail);

              const loggedInUsrBal = users.filter((u) => u.uid === user.uid)[0]
                .balance;
              console.log(loggedInUsrBal);

              const usersEmail = users.map((usr) => usr.email);
              console.log(usersEmail);
              console.log(usersEmail.includes(transferTo));

              if (
                usersEmail.includes(transferTo) &&
                transferTo !== "" &&
                transferTo !== loggedInUsrEmail &&
                transferAmount !== "" &&
                transferAmount > 0 &&
                transferAmount < 0.5 * loggedInUsrBal
              ) {
                setShowModal(true);
              } else {
                setErr({
                  title: "An error occured!",
                  message: "Please fill in the fields correctly.",
                });
              }

              if (transferTo === loggedInUsrEmail) {
                setErr({
                  title: "An error occured!",
                  message: "Transaction not allowed.",
                });
              }

              if (
                !usersEmail.includes(transferTo) &&
                transferTo !== "" &&
                transferTo !== loggedInUsrEmail &&
                transferAmount !== "" &&
                transferAmount > 0 &&
                transferAmount < 0.5 * loggedInUsrBal
              ) {
                setErr({
                  title: "An error occured!",
                  message: "User does not exist.",
                });
              }
            }}
          >
            Transfer
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
              Are you sure to transfer{" "}
              <strong style={{ color: color }}>${transferAmount}</strong> to{" "}
              <strong style={{ color: color }}>{transferTo}</strong>?
            </p>
            <div className="butn-container">
              <button className="butn yes" onClick={handleTransfer}>
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
