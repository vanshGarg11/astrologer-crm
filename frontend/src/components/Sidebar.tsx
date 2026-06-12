import { CalendarDays, ChevronLeft, ChevronRight, LayoutDashboard, MoonStar, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Navigation links configuration
const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/astrologers', label: 'Astrologers', icon: MoonStar },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/consultations', label: 'Consultations', icon: CalendarDays },
];

export default function Sidebar({
  open,
  collapsed,
  onCollapsedChange,
  onClose,
}: {
  open: boolean;
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
  onClose: () => void;
}) {
  const width = collapsed ? 'lg:w-20' : 'lg:w-64';
  return (
    <>
      {/* Mobile overlay - closes sidebar when clicked */}
      {open && <button className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm transition-all duration-200 lg:hidden" onClick={onClose} />}
      
      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200/70 bg-white/90 px-4 py-5 shadow-md shadow-slate-200/40 backdrop-blur-xl transition-all duration-300 lg:translate-x-0 dark:border-slate-800/70 dark:bg-slate-950/90 dark:shadow-black/30 ${width} ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white shadow-sm dark:bg-white dark:text-slate-950">AC</div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-base font-bold tracking-tight text-slate-950 dark:text-white">Astrologer</p>
                <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">Admin</p>
              </div>
            )}
          </div>
          
          {/* Collapse/Expand Button */}
          <button
            className="hidden rounded-md border border-slate-200 bg-white/70 p-1.5 text-slate-500 shadow-sm transition duration-150 hover:border-slate-400 hover:text-slate-900 lg:block dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-slate-500 dark:hover:text-white"
            onClick={() => onCollapsedChange(!collapsed)}
            title="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition duration-150 ${collapsed ? 'lg:justify-center' : ''} ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
              title={label}
            >
              <Icon size={18} className="flex-shrink-0" /> {!collapsed && <span className="flex-1">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
