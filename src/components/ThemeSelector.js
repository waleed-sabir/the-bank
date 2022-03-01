// styles
import "./ThemeSelector.css";
import { useTheme } from "../hooks/useTheme";
import modeIcon from "../assets/mode-icon.svg";
import React from "react";

const themeColors = ["#A63D40", "#90A959", "#6494AA"];
export default function ThemeSelector() {
  const { changeColor, mode, changeMode } = useTheme();

  const toggleMode = () => {
    changeMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <div className="theme-selector">
      <div className="mode-toggle">
        <img
          src={modeIcon}
          alt="theme toggle button"
          onClick={toggleMode}
          style={{ filter: mode === "dark" ? "invert(100%)" : "invert(20%)" }}
        />
      </div>
      <div className="theme-buttons">
        {themeColors.map((color) => (
          <div
            key={color}
            onClick={() => changeColor(color)}
            style={{ background: color }}
          />
        ))}
      </div>
    </div>
  );
}
