// styles
import "./Signup.css";

import React, { useState } from "react";
import { useSignup } from "../../hooks/useSignup";

export default function Signup() {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { error, isPending, signup } = useSignup();

  const submitHandler = (e) => {
    e.preventDefault();
    signup(email, password, displayName);
  };

  return (
    <form className="register-form" onSubmit={submitHandler}>
      <h2>Signup</h2>
      <label>
        <span>Name:</span>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </label>

      <label>
        <span>Display Name:</span>
        <input
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>

      <label>
        <span>Email:</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>

      <label>
        <span>Password:</span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      {!isPending && <button className="btn register">Signup</button>}
      {isPending && (
        <button className="btn loading" disabled>
          Loading...
        </button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
}
