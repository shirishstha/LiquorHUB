import { useTheme } from '@/context/theme';
import { Moon, Sun } from 'lucide-react';
import React from 'react'


const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();
  return (
    <button 
      onClick={()=>setTheme(theme === 'light' ? 'dark' : 'light')}
      className= 'flex items-center justify-center h-10 w-10 cursor-pointer pr-5 '
    >
      {theme === 'light'? <Moon className='w-5 h-5'/> : <Sun className='w-5 h-5'/>}

    </button >
  )
}

export default ThemeToggle;