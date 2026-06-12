import { AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('admin@crm.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function validateForm() {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
    if (!password.trim()) errors.password = 'Password is required.';
    return errors;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(email.trim(), password);
      login(response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_420px]">
        <section className="hidden animate-enter-up lg:block">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
            <ShieldCheck size={14} /> Secure admin workspace
          </div>
          <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Astrologer CRM for focused admin operations.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
            Manage astrologers, customers, and consultation schedules with a polished dashboard built for fast demos and real workflows.
          </p>
          <div className="mt-8 grid max-w-lg gap-3">
            {['JWT protected admin access', 'MongoDB Atlas backed records', 'Responsive dashboard and CRUD flows'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white/70 p-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <CheckCircle2 className="text-indigo-600 dark:text-sky-400" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={submit} className="glass-panel animate-enter-up w-full rounded-md p-7">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-md bg-slate-950 text-2xl font-bold text-white shadow-md dark:bg-white dark:text-slate-950">
              AC
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Admin Login</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Astrologer CRM Dashboard</p>
          </div>

          <div className="mb-6 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/60">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Demo Credentials</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Email: <span className="font-mono">admin@crm.com</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Password: <span className="font-mono">admin123</span>
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <label className="block text-sm font-medium">
            Email
            <input className="input-surface mt-1 w-full px-3 py-2.5 shadow-sm" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            {fieldErrors.email && <span className="mt-1 block text-xs text-rose-600">{fieldErrors.email}</span>}
          </label>

          <label className="mt-4 block text-sm font-medium">
            Password
            <input className="input-surface mt-1 w-full px-3 py-2.5 shadow-sm" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
            {fieldErrors.password && <span className="mt-1 block text-xs text-rose-600">{fieldErrors.password}</span>}
          </label>

          <Button className="mt-6 w-full" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : <>Login <ArrowRight size={16} /></>}
          </Button>
        </form>
      </div>
    </main>
  );
}
