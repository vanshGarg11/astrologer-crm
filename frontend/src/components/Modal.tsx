import { X } from 'lucide-react';
import { ReactNode } from 'react';

export default function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm transition-all duration-200">
      <section className="animate-enter-up max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-slate-200 bg-white p-6 shadow-lg transition dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h2>
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
