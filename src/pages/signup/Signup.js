// styles
import "./Signup.css";

import React, { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(name, displayName, email, password);
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
      <button className="btn register">Signup</button>
    </form>
  );
}
