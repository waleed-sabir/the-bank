import { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
} from "firebase/auth";
import { useAuthContext } from "./useAuthContext";
import { useFirestore } from "./useFirestore";

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
  // anonymous signup

  const anonymousSignup = async () => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const response = await signInAnonymously(auth);
      // console.log(res.user);

      if (!response) {
        throw new Error("Could not complete the signup");
      }

      // add displayName to user
      await updateProfile(response.user, { displayName: "Anonymous user" });

      // create a user document

      addDocument({
        uid: response.user.uid,
        displayName: "Anonymous user",
        balance: 100000,
      });

      // dispatch a LOGIN action
      dispatch({ type: "LOGIN", payload: response.user });

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

  return { error, isPending, signup, anonymousSignup };
};
