import React, { useState, useEffect } from "react";
import { FiMoon } from "react-icons/fi";
import { HiOutlineSun } from "react-icons/hi2";

function ThemeBtn() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return <button className="theme-btn" onClick={toggleTheme}>{theme === "light" ? <FiMoon/> : <HiOutlineSun />}</button>;
}

export default ThemeBtn;