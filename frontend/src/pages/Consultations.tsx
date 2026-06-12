import { Download, Edit, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import { TableSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import { astrologerApi, consultationApi, customerApi } from '../services/api';
import { Astrologer, Consultation, ConsultationStatus, Customer, FormErrors } from '../types';
import { validateRequired } from '../utils/validation';

const blank = { customer_id: '', astrologer_id: '', consultation_date: '', consultation_time: '', status: 'Pending' as ConsultationStatus, notes: '' };

export default function Consultations() {
  const [items, setItems] = useState<Consultation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Consultation | null>(null);
  const [form, setForm] = useState<Omit<Consultation, 'id' | 'customer_name' | 'astrologer_name'>>(blank);
  const [errors, setErrors] = useState<FormErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const filtered = useMemo(() => items.filter((item) => {
    const haystack = `${item.customer_name} ${item.astrologer_name} ${item.notes}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (!status || item.status === status);
  }), [items, search, status]);

  function load() {
    setLoading(true);
    Promise.all([consultationApi.list(), customerApi.list(), astrologerApi.list()]).then(([c, customersRes, astrologersRes]) => {
      setItems(c.items);
      setCustomers(customersRes.items);
      setAstrologers(astrologersRes.items);
    }).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openForm(item?: Consultation) {
    setErrors({});
    setEditing(item || null);
    setForm(item ? {
      customer_id: item.customer_id,
      astrologer_id: item.astrologer_id,
      consultation_date: item.consultation_date,
      consultation_time: item.consultation_time.slice(0, 5),
      status: item.status,
      notes: item.notes || '',
    } : { ...blank, customer_id: customers[0]?.id || '', astrologer_id: astrologers[0]?.id || '' });
    setFormOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateRequired(form, ['customer_id', 'astrologer_id', 'consultation_date', 'consultation_time', 'status']);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      editing ? await consultationApi.update(editing.id, form) : await consultationApi.create(form);
      showToast(editing ? 'Consultation updated.' : 'Consultation scheduled.');
      setFormOpen(false);
      load();
    } catch (error: any) {
      setErrors(error.response?.data?.errors || { form: 'Unable to save consultation.' });
    }
  }

  function exportCsv() {
    const header = ['ID', 'Customer', 'Astrologer', 'Date', 'Time', 'Status', 'Notes'];
    const rows = filtered.map((item) => [item.id, item.customer_name, item.astrologer_name, item.consultation_date, item.consultation_time, item.status, item.notes]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'consultations.csv';
    link.click();
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Consultations"
        description="Schedule, update, filter, and export consultation records."
        actions={<><Button variant="outline" onClick={exportCsv}><Download size={18} /> CSV</Button><Button onClick={() => openForm()}><Plus size={18} /> Add</Button></>}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search consultations..." />
        <select className="input-surface px-3 py-2 text-sm shadow-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>
      {loading ? <TableSkeleton /> : (
        <DataTable<Consultation>
          data={filtered}
          columns={[
            { key: 'customer_name', header: 'Customer', sortable: true },
            { key: 'astrologer_name', header: 'Astrologer', sortable: true },
            { key: 'consultation_date', header: 'Date', sortable: true },
            { key: 'consultation_time', header: 'Time' },
            { key: 'status', header: 'Status', sortable: true },
            { key: 'notes', header: 'Notes' },
          ]}
          actions={(row) => <RowActions onEdit={() => openForm(row)} onDelete={() => setDeleteId(row.id)} />}
        />
      )}
      {formOpen && (
        <Modal title={editing ? 'Edit Consultation' : 'Create Consultation'} onClose={() => setFormOpen(false)}>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Select label="customer" value={form.customer_id} error={errors.customer_id} onChange={(value) => setForm({ ...form, customer_id: value })} options={customers.map((item) => ({ value: item.id, label: item.name }))} />
            <Select label="astrologer" value={form.astrologer_id} error={errors.astrologer_id} onChange={(value) => setForm({ ...form, astrologer_id: value })} options={astrologers.map((item) => ({ value: item.id, label: item.name }))} />
            <Field label="date" type="date" value={form.consultation_date} error={errors.consultation_date} onChange={(value) => setForm({ ...form, consultation_date: value })} />
            <Field label="time" type="time" value={form.consultation_time} error={errors.consultation_time} onChange={(value) => setForm({ ...form, consultation_time: value })} />
            <Select label="status" value={form.status} error={errors.status} onChange={(value) => setForm({ ...form, status: value as ConsultationStatus })} options={['Pending', 'Completed', 'Cancelled'].map((item) => ({ value: item, label: item }))} />
            <label className="block text-sm font-medium sm:col-span-2 text-slate-900 dark:text-slate-100">
              Notes
              <textarea className="input-surface mt-2 min-h-24 w-full px-4 py-2.5 shadow-sm transition" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </label>
            {errors.form && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2 dark:bg-rose-950 dark:text-rose-200">{errors.form}</p>}
            <Button type="submit" className="sm:col-span-2">Save</Button>
          </form>
        </Modal>
      )}
      {deleteId && <ConfirmationDialog title="Delete Consultation" message="This consultation will be permanently removed." onCancel={() => setDeleteId(null)} onConfirm={async () => { await consultationApi.remove(deleteId); showToast('Consultation deleted.'); setDeleteId(null); load(); }} />}
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return <div className="flex justify-end gap-2"><Button variant="outline" className="min-h-9 px-3" onClick={onEdit}><Edit size={16} /></Button><Button variant="outline" className="min-h-9 px-3 text-rose-600 hover:text-rose-700" onClick={onDelete}><Trash2 size={16} /></Button></div>;
}

function Field({ label, value, onChange, error, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string }) {
  return (
    <label className="block text-sm font-medium capitalize text-slate-900 dark:text-slate-100">
      {label}
      <input
        className={`input-surface mt-2 w-full px-4 py-2.5 shadow-sm transition ${
          error ? 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200 dark:border-rose-700 dark:bg-rose-950/20 dark:ring-rose-800' : ''
        }`}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-300">
          <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.415-1.414L11 16.586V5a1 1 0 10-2 0v11.586L3.314 11.516a1 1 0 00-1.414 1.414l9 9a1 1 0 001.414 0l9-9z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </label>
  );
}

function Select({ label, value, onChange, error, options }: { label: string; value: string | number; onChange: (value: string) => void; error?: string; options: { value: string | number; label: string }[] }) {
  return (
    <label className="block text-sm font-medium capitalize text-slate-900 dark:text-slate-100">
      {label}
      <select
        className={`input-surface mt-2 w-full px-4 py-2.5 shadow-sm transition ${
          error ? 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200 dark:border-rose-700 dark:bg-rose-950/20 dark:ring-rose-800' : ''
        }`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-300">
          <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.415-1.414L11 16.586V5a1 1 0 10-2 0v11.586L3.314 11.516a1 1 0 00-1.414 1.414l9 9a1 1 0 001.414 0l9-9z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </label>
  );
}
