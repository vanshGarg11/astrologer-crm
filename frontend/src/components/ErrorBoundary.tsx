import { Component, ErrorInfo, ReactNode } from 'react';
import Button from './Button';

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
          <section className="max-w-md rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-xl font-semibold text-slate-950 dark:text-white">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Refresh the workspace and try again.</p>
            <Button className="mt-5" onClick={() => window.location.reload()}>Refresh</Button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
