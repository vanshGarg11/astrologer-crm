import { ReactNode } from 'react';

export default function DashboardCard({ title, value, icon, caption }: { title: string; value: number; icon: ReactNode; caption?: string }) {
  return (
    <section className="glass-panel group overflow-hidden rounded-md p-6 transition duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">{value.toLocaleString()}</p>
          {caption && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{caption}</p>}
        </div>
        <div className="ml-4 flex-shrink-0 rounded-md bg-slate-100 p-4 text-slate-700 ring-1 ring-slate-200 transition duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:group-hover:bg-slate-700">{icon}</div>
      </div>
    </section>
  );
}
