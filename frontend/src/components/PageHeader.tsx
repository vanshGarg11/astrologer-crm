import { ReactNode } from 'react';

export default function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 h-1 w-10 rounded-sm bg-slate-950 dark:bg-white" />
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
