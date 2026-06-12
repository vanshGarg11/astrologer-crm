import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ onMenu }: { onMenu: () => void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl transition dark:border-slate-800/70 dark:bg-slate-950/85">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="rounded-md border border-slate-200 bg-white/70 p-2 shadow-sm transition duration-150 hover:border-slate-400 lg:hidden dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-slate-500"
          onClick={onMenu}
          title="Open menu"
        >
          <Menu size={18} />
        </button>
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 transition dark:text-slate-400">Admin Console</p>
          <p className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">Consultation Ops</p>
        </div>
        <div className="hidden min-w-0 flex-1 px-8 md:block" />
        <div className="flex items-center gap-3">
          <button
            className="rounded-md border border-slate-200 bg-white/70 p-2 shadow-sm transition duration-150 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-slate-500"
            onClick={() => setDark((value) => !value)}
            title="Toggle dark mode"
          >
            {dark ? <Sun size={18} className="text-slate-100" /> : <Moon size={18} className="text-slate-700" />}
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
