import React, { createContext, useContext, useState,useEffect } from 'react'
import toast from 'react-hot-toast';

const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        toast.success('Dark mode enabled Successfully');
      } else {
        document.documentElement.classList.remove('dark');
        toast.success('Light mode enabled Successfully');
      }
      localStorage.setItem('theme', theme);
    } else {
      setMounted(true);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};
//custom hook
const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme }
