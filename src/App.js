import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// styles
import "./App.css";

// page components
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Navbar from "./components/Navbar";
import ThemeSelector from "./components/ThemeSelector";

import { useTheme } from "./hooks/useTheme";

function App() {
  const { mode } = useTheme();
  const { authIsReady, user } = useAuthContext();

  return (
    <div className={`App ${mode}`}>
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <ThemeSelector />
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={user ? <Home /> : <Login />} />
            <Route path="/signup" element={user ? <Home /> : <Signup />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
