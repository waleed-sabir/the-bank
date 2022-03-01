// styles
import "./Home.css";

import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Home() {
  const { user } = useAuthContext();

  return (
    <div className="home">
      <h1>Welcome to theBank, {user.displayName}!</h1>
    </div>
  );
}
