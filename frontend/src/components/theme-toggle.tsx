'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Only run on client to avoid server-side hydration mismatches
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  // Avoid hydration mismatch by rendering a placeholder of equal size until mounted
  if (!mounted) {
    return (
      <div 
        style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '10px', 
          background: 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(0,0,0,0.05)' 
        }} 
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      style={{
        background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
        border: '1px solid var(--glass-border)',
        cursor: 'pointer',
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-main)',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
      }}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? (
        <Moon size={18} style={{ transform: 'rotate(0deg)', transition: 'all 0.5s ease' }} />
      ) : (
        <Sun size={18} style={{ transform: 'rotate(180deg)', transition: 'all 0.5s ease' }} />
      )}
    </button>
  );
}
