import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen text-slate-950 dark:text-slate-100">
      <Sidebar open={open} collapsed={collapsed} onCollapsedChange={setCollapsed} onClose={() => setOpen(false)} />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Navbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="animate-enter-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
