// styles
import "./Home.css";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useFirestore } from "../../hooks/useFirestore";
import { useLogout } from "../../hooks/useLogout";
import { deleteUser } from "@firebase/auth";
import { useTheme } from "../../hooks/useTheme";

// Icon
import helpIcon from "../../assets/help.svg";
import closeIcon from "../../assets/close.svg";

// page components
import Modal from "../../components/Modal";

// Tippy
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function DeleteAccount({ uid, displayName }) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { documents: users } = useCollection("users");
  const { documents: transactions } = useCollection("transactions");
  const { deleteDocument: delUserDoc, response: resUserDoc } =
    useFirestore("users");
  const { deleteDocument: delTransDoc, response: resTransDoc } =
    useFirestore("transactions");

  const { logout } = useLogout();

  const { user } = useAuthContext();
  const { mode, color } = useTheme();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    console.log(user);

    // Logged in user
    const userLoggedIn = users.filter((u) => u.uid === user.uid);
    const userLoggedInEmail = userLoggedIn[0].email;
    const userLoggedInId = userLoggedIn[0].id;

    // Logged in user's transactions
    const userTransactions = transactions.filter((t) => t.uid === user.uid);

    try {
      if (userLoggedInEmail === confirmEmail) {
        await userTransactions.map((ut) => {
          delTransDoc(ut.id);
          console.log(resTransDoc);
          console.log("user transactions deleted");
        });

        await delUserDoc(userLoggedInId);
        console.log(resUserDoc);
        console.log("user deleted from users collection");

        await deleteUser(user);
        console.log("user deleted");

        logout();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const hideModal = (e) => {
      if (e.path[0].className === "modal-backdrop" || e.key === "Escape") {
        setShowModal(false);
      }
    };

    document.body.addEventListener("click", hideModal);
    document.body.addEventListener("keydown", hideModal);

    if (resUserDoc.success && resTransDoc.success) {
      setConfirmEmail("");
      setShowModal(false);
    }

    return () => {
      document.body.removeEventListener("click", hideModal);
      document.body.removeEventListener("keydown", hideModal);
    };
  }, [resUserDoc.success, resTransDoc.success]);

  return (
    <>
      {/* DELETE ACCOUNT */}
      <div className={`close ${mode}`}>
        <h3>
          Close Account{" "}
          <Tippy content="Delete user account and transactions of the logged in user">
            <img src={helpIcon} alt="help icon" />
          </Tippy>
        </h3>

        <form>
          <label>
            <span>
              Email address:
              <Tippy content="Enter your email address">
                <img src={helpIcon} alt="help icon" />
              </Tippy>
            </span>
            <input
              type="email"
              required
              placeholder="e.g. username@thebank.org"
              onChange={(e) => setConfirmEmail(e.target.value)}
              value={confirmEmail}
            />
          </label>

          <button
            className="btn delete"
            onClick={(e) => {
              e.preventDefault();
              if (confirmEmail !== "") {
                setShowModal(true);
              } else {
                throw new Error("Please enter an email address");
              }
            }}
          >
            Close account
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
              Are you sure to delete the account{" "}
              <strong style={{ color: color }}>{confirmEmail}</strong>?
            </p>
            <div className="butn-container">
              <button className="butn yes" onClick={handleDeleteAccount}>
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
