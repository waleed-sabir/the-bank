// styles
import "./Navbar.css";
import bankIcon from "../assets/bank.svg";

import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      <ul>
        <li className="logo">
          <img src={bankIcon} alt="bank logo" />
          <span>myBank</span>
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
