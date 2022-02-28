// styles
import "./Navbar.css";
import bankIcon from "../assets/bank.svg";

import React from "react";
import { Link } from "react-router-dom";

import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
  const { color } = useTheme();
  return (
    <div className="navbar" style={{ background: color }}>
      <ul>
        <li className="logo">
          <img src={bankIcon} alt="bank logo" />
          <span>theBank</span>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>

        <li>
          <Link to="/signup">Signup</Link>
        </li>

        <li>
          <button className="btn logout">Logout</button>
        </li>
      </ul>
    </div>
  );
}