// styles
import "./Navbar.css";
import bankIcon from "../assets/bank.svg";

import React from "react";
import { Link } from "react-router-dom";

import { useTheme } from "../hooks/useTheme";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navbar() {
  const { mode, color } = useTheme();
  const { logout } = useLogout();
  const { user } = useAuthContext();

  return (
    <div className={`navbar ${mode}`} style={{ background: color }}>
      <ul>
        <li className="logo">
          <img src={bankIcon} alt="bank logo" />
          <span>TheBank</span>
        </li>

        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>

            <li>
              <Link to="/signup">Signup</Link>
            </li>

            <li>
              <Link to="/demo">Demo</Link>
            </li>
          </>
        )}

        {user && (
          <>
            <li className="displayname">Hello, {user.displayName}</li>
            <li>
              <button
                className="btn logout"
                // style={{ background: color }}
                onClick={logout}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
