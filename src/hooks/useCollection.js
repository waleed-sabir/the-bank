import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { db } from "../firebase/config";

export const useCollection = (clt, _q) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  const q = useRef(_q).current;

  useEffect(() => {
    let colRef = collection(db, clt);
    if (q) {
      colRef = query(colRef, where(...q), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError(error.message);
      }
    );

    //   unsubscribe on unmount
    return () => unsubscribe();
  }, [clt, q]);

  return { documents, error };
};
