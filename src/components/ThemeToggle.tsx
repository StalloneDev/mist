"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span style={{ color: 'orange', fontWeight: 'bold' }}>[Chargement Thème...]</span>;
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{
        padding: '8px 12px',
        background: '#3b82f6',
        color: 'white',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '12px'
      }}
    >
      {theme === "light" ? "🌙 PASSER AU NOIR" : "☀️ PASSER AU BLANC"}
    </button>
  );
}
