// styles
import "./Login.css";

import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isPending, error } = useLogin();

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form className="login-form" onSubmit={submitHandler}>
      <h2>Login</h2>
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
      {!isPending && <button className="btn login">Login</button>}
      {isPending && (
        <button className="btn loading" disabled>
          loading...
        </button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
}
