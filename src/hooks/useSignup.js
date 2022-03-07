import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";
import { useFirestore } from "./useFirestore";

// import { doc, setDoc, collection } from "firebase/firestore";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const { addDocument } = useFirestore("users");

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // console.log(res.user);

      if (!res) {
        throw new Error("Could not complete the signup");
      }

      // add displayName to user
      await updateProfile(res.user, { displayName });

      // create a user document
      // const colRef = doc(collection(db, "users"));
      // await setDoc(colRef, { uid: res.user.uid, displayName });
      addDocument({
        uid: res.user.uid,
        displayName,
        email: res.user.email,
        balance: 100000,
      });

      // dispatch a LOGIN action
      dispatch({ type: "LOGIN", payload: res.user });

      // update state

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signup };
};
