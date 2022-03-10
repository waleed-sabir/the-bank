// styles
import "./Home.css";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useFirestore } from "../../hooks/useFirestore";
import { useLogout } from "../../hooks/useLogout";
import { deleteUser } from "@firebase/auth";
import { useTheme } from "../../hooks/useTheme";

export default function DeleteAccount({ uid, displayName }) {
  const [confirmEmail, setConfirmEmail] = useState("");

  const { documents: users } = useCollection("users");
  const { documents: transactions } = useCollection("transactions");
  const { deleteDocument: delUserDoc, response } = useFirestore("users");
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
        await deleteUser(user);
        console.log("user deleted");

        await delUserDoc(userLoggedInId);
        console.log("user deleted from users collection");

        await userTransactions.map((ut) => {
          delTransDoc(ut.id);
          console.log("user transactions deleted");
        });
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
    if (response.success) {
      setConfirmEmail("");
    }
  }, [response.success]);

  return (
    <>
      {/* DELETE ACCOUNT */}
      <div className={`close ${mode}`}>
        <h3>Close account</h3>
        <form>
          <label>
            <span>Confirm email:</span>
            <input
              type="email"
              onChange={(e) => setConfirmEmail(e.target.value)}
              value={confirmEmail}
            />
          </label>

          <button className="btn delete" onClick={handleDeleteAccount}>
            Delete
          </button>
        </form>
      </div>
    </>
  );
}
