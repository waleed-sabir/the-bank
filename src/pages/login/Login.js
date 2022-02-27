// styles
import "./Login.css";

import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <form className="login-form" onSubmit={submitHandler}>
      <h2>Login</h2>
      <label>
        <span>Email:</span>
        <input
          type="text"
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
      <button className="btn login">Login</button>
    </form>
  );
}
