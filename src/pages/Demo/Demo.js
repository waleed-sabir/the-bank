// styles
import "./Demo.css";

import React from "react";
import { useSignup } from "../../hooks/useSignup";
import { useTheme } from "../../hooks/useTheme";

export default function Demo() {
  const { anonymousSignup, error, isPending } = useSignup();
  const { mode, color } = useTheme();

  const handleClick = async () => anonymousSignup();

  return (
    <div className={`demo ${mode}`}>
      <h2>Sign in as an Anonymous User</h2>
      <p className="demo-text">
        You can test the app as an anonymous user. Anonymous users can visit the
        website and view its functionality. However, they can only use the{" "}
        <strong style={{ color: color }}>Transfer Money</strong> and{" "}
        <strong style={{ color: color }}>Request Loan</strong> feature but are
        not allowed to use the{" "}
        <strong style={{ color: color }}> Close Account</strong> feature.
      </p>
      {!isPending && (
        <button
          title="Sign in as a demo user"
          className="btn"
          onClick={handleClick}
          style={{ backgroundColor: color }}
        >
          Anonymous user sign-in
        </button>
      )}
      {isPending && (
        <button title="Sign in as a demo user" className="btn" disabled>
          Loading...
        </button>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
