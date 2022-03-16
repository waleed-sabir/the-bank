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

// Tippy
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function DeleteAccount({ uid, displayName }) {
  const [confirmEmail, setConfirmEmail] = useState("");

  const { documents: users } = useCollection("users");
  const { documents: transactions } = useCollection("transactions");
  const { deleteDocument: delUserDoc, response: resUserDoc } =
    useFirestore("users");
  const { deleteDocument: delTransDoc, response: resTransDoc } =
    useFirestore("transactions");

  const { logout } = useLogout();

  const { user } = useAuthContext();
  const { mode } = useTheme();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    console.log(user);

    // Logged in user
    const userLoggedIn = users.filter((u) => u.uid === user.uid);
    const userLoggedInEmail = userLoggedIn[0].email;
    const userLoggedInId = userLoggedIn[0].id;

    // Logged in user's transactions
    const userTransactions = transactions.filter((t) => t.uid === user.uid);
    // userTransactions.map((ut) => console.log(ut.id));

    // console.log(
    //   userLoggedIn,
    //   userLoggedInId,
    //   userLoggedInEmail,
    //   userTransactions
    // );

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

  //   console.log(userLoggedIn, userLoggedInEmail, userLoggedInId, user);

  //   if (userLoggedInEmail === confirmEmail) {
  //     delUserDoc(userLoggedInId);
  //     logout();
  //   }
  // };

  useEffect(() => {
    if (resUserDoc.success && resTransDoc.success) {
      setConfirmEmail("");
    }
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

          <button className="btn delete" onClick={handleDeleteAccount}>
            Close account
          </button>
        </form>
      </div>
    </>
  );
}
