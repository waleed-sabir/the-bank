// styles
import "./Home.css";

import React, { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";

export default function TransferMoney({ uid, displayName }) {
  const [trasnferTo, setTrasnferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const { documents: users, error } = useCollection("users");

  const { addDocument, response } = useFirestore("transactions");
  const { updateDocument, response: updateDocRes } = useFirestore("users");

  const handleTransfer = (e) => {
    e.preventDefault();

    const transferObj = {
      trasnferTo,
      transferAmount,
      uid,
      displayName,
    };

    addDocument(transferObj);

    //   updating balance of SENDER in 'users' collection
    const senderDoc = users.filter((u) => u.uid === transferObj.uid);
    const senderUpdatedBalance = senderDoc[0].balance - +transferAmount;
    updateDocument(senderDoc[0].id, {
      balance: senderUpdatedBalance,
    });
    console.log(senderUpdatedBalance);

    //   updating balance of RECEIVER in 'users' collection
    const receiverDoc = users.filter((u) => u.email === transferObj.trasnferTo);
    const receiverUpdatedBalance = receiverDoc[0].balance + +transferAmount;
    updateDocument(receiverDoc[0].id, {
      balance: receiverUpdatedBalance,
    });
    console.log(receiverUpdatedBalance);
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
      <div className="money">
        <h3>Transfer money</h3>
        <form onSubmit={handleTransfer}>
          <label>
            <span>Transfer to:</span>
            <input
              type="email"
              onChange={(e) => setTrasnferTo(e.target.value)}
              value={trasnferTo}
            />
          </label>
          <label>
            <span>Amount $:</span>
            <input
              type="text"
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
