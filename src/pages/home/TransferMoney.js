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

export default function TransferMoney({ uid, displayName, email }) {
  const [transferTo, setTrasnferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const { documents: users, error } = useCollection("users");
  const { documents: transactions, error: err } = useCollection("transactions");
  const { user } = useAuthContext();
  const { mode } = useTheme();

  const [allUsers, setAllUsers] = useState([]);

  const { addDocument, response } = useFirestore("transactions");
  //   const { addDocument: addRecvDoc } = useFirestore("transactions");
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
    } else {
      throw new Error();
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
    // const transferredAmount = +transferObj.transferAmount;
    updateDocument(receiverDoc[0].id, {
      balance: receiverUpdatedBalance,
      //   amountReceived: transferredAmount,
    });
    console.log(receiverDoc);

    //   adding the transferred amount in RECEIVER's 'transactions' collection

    // const recvDoc = transactions.filter(
    //   (t) => t.transferTo === transferObj.transferTo
    // );
    // const transferredAmount = +transferObj.transferAmount;
    // console.log(recvDoc);

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
    if (response.success) {
      setTrasnferTo("");
      setTransferAmount("");
    }
  }, [response.success]);

  return (
    <>
      {/* TRANSFER MONEY */}
      <div className={`money ${mode}`}>
        <h3>
          Transfer Money{" "}
          <Tippy content="Transfer money to other existing users' accounts">
            <img src={helpIcon} alt="help icon" />
          </Tippy>
        </h3>
        <form onSubmit={handleTransfer}>
          <label>
            <span>
              Transfer to:
              <Tippy content="Enter recipient's email address">
                <img src={helpIcon} alt="help icon" />
              </Tippy>
            </span>
            <input
              type="email"
              placeholder="e.g. mario@thebank.org"
              required
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
          <button className="btn">Transfer</button>
        </form>
      </div>
    </>
  );
}
