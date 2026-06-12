import { CalendarClock, CalendarDays, MoonStar, Users } from 'lucide-react';
import { CSSProperties, useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import PageHeader from '../components/PageHeader';
import { Skeleton } from '../components/Skeleton';
import { dashboardApi } from '../services/api';
import { DashboardStats } from '../types';

const statusStyle: Record<string, { dot: string; bar: string; panel: string; text: string }> = {
  Pending: {
    dot: 'bg-indigo-500',
    bar: 'bg-indigo-500',
    panel: 'border-indigo-200 bg-indigo-50/65 dark:border-indigo-900/60 dark:bg-indigo-950/18',
    text: 'text-indigo-700 dark:text-indigo-300',
  },
  Completed: {
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
    panel: 'border-emerald-200 bg-emerald-50/65 dark:border-emerald-900/60 dark:bg-emerald-950/18',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  Cancelled: {
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
    panel: 'border-rose-200 bg-rose-50/65 dark:border-rose-900/60 dark:bg-rose-950/18',
    text: 'text-rose-700 dark:text-rose-300',
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .stats()
      .then((response) => setStats(response.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-80" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32" />)}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!stats) return <p className="text-sm text-red-600">Dashboard could not be loaded.</p>;

  const total = Math.max(stats.total_consultations, 1);
  const statuses = Object.entries(stats.status_breakdown) as [string, number][];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="A live view of consultations, customer growth, and astrologer operations." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Astrologers" value={stats.total_astrologers} icon={<MoonStar size={24} />} caption="Active supply network" />
        <DashboardCard title="Total Customers" value={stats.total_customers} icon={<Users size={24} />} caption="Registered profiles" />
        <DashboardCard title="Total Consultations" value={stats.total_consultations} icon={<CalendarDays size={24} />} caption="All-time bookings" />
        <DashboardCard title="Upcoming Consultations" value={stats.upcoming_consultations} icon={<CalendarClock size={24} />} caption="Pending from now" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="glass-panel rounded-md p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Consultation Analytics</h2>
            <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Status Mix
            </span>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
            <div
              className="relative mx-auto flex size-48 items-center justify-center rounded-full bg-[conic-gradient(#6366f1_var(--pending),#10b981_var(--pending),#10b981_var(--completed),#e11d48_var(--completed))]"
              style={{
                '--pending': `${(stats.status_breakdown.Pending / total) * 100}%`,
                '--completed': `${((stats.status_breakdown.Pending + stats.status_breakdown.Completed) / total) * 100}%`,
              } as CSSProperties}
            >
              <div className="flex size-32 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner dark:bg-slate-900">
                <span className="text-4xl font-semibold text-slate-950 dark:text-white">{stats.total_consultations}</span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">consultations</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {statuses.map(([label, value]) => {
                const style = statusStyle[label] || statusStyle.Pending;
                return (
                  <div key={label} className={`rounded-md border p-3 ${style.panel}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`size-2.5 rounded-sm ${style.dot}`} />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{label}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{value}</span>
                    </div>
                    <div className="h-2 rounded-sm bg-slate-200 dark:bg-slate-700">
                      <div className={`h-2 rounded-sm ${style.bar}`} style={{ width: `${(value / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
          <div className="mt-5 space-y-3">
            {stats.recent_consultations.map((item) => {
              const style = statusStyle[item.status] || statusStyle.Pending;
              return (
                <div key={item.id} className={`rounded-md border p-4 transition hover:-translate-y-0.5 ${style.panel}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {item.customer_name || 'Customer'} <span className="text-slate-400">with</span> {item.astrologer_name || 'Astrologer'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {item.consultation_date} at {item.consultation_time}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 rounded-md border border-current/20 px-2.5 py-1 text-xs font-semibold ${style.text}`}>
                      <span className={`size-2 rounded-sm ${style.dot}`} />
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {!stats.recent_consultations.length && <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">No consultation activity yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
