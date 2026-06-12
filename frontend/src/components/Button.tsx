import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus:ring-slate-400 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200',
  secondary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:ring-indigo-400 dark:bg-sky-500 dark:text-white dark:hover:bg-sky-400',
  outline: 'border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-500 hover:bg-slate-50 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800',
  danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus:ring-rose-400',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus:ring-slate-300 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
};

export default function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-950 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
