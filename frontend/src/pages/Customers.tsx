import { Edit, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import Button from '../components/Button';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import { TableSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import { customerApi } from '../services/api';
import { Customer, FormErrors } from '../types';
import { mergeErrors, validateEmailPhone, validateRequired } from '../utils/validation';

const blank = { name: '', phone: '', email: '', dob: '', city: '' };

export default function Customers() {
  const [items, setItems] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Omit<Customer, 'id'>>(blank);
  const [errors, setErrors] = useState<FormErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  function load() {
    setLoading(true);
    customerApi.list().then((response) => setItems(response.items)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openForm(item?: Customer) {
    setErrors({});
    setEditing(item || null);
    setForm(item ? { ...item } : blank);
    setFormOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = mergeErrors(validateRequired(form, Object.keys(blank)));
    validateEmailPhone(form, nextErrors);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      editing ? await customerApi.update(editing.id, form) : await customerApi.create(form);
      showToast(editing ? 'Customer updated.' : 'Customer created.');
      setFormOpen(false);
      load();
    } catch (error: any) {
      setErrors(error.response?.data?.errors || { form: 'Unable to save customer.' });
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Customers" description="Manage customer profiles and contact details." actions={<Button onClick={() => openForm()}><Plus size={18} /> Add</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
      {loading ? <TableSkeleton /> : (
        <DataTable<Customer>
          data={filtered}
          columns={[
            { key: 'name', header: 'Name', sortable: true },
            { key: 'phone', header: 'Phone' },
            { key: 'email', header: 'Email', sortable: true },
            { key: 'dob', header: 'DOB', sortable: true },
            { key: 'city', header: 'City', sortable: true },
          ]}
          actions={(row) => <RowActions onEdit={() => openForm(row)} onDelete={() => setDeleteId(row.id)} />}
        />
      )}
      {formOpen && (
        <Modal title={editing ? 'Edit Customer' : 'Add Customer'} onClose={() => setFormOpen(false)}>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Field label="name" value={form.name} error={errors.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Field label="phone" value={form.phone} error={errors.phone} onChange={(value) => setForm({ ...form, phone: value })} />
            <Field label="email" value={form.email} error={errors.email} onChange={(value) => setForm({ ...form, email: value })} />
            <Field label="dob" type="date" value={form.dob} error={errors.dob} onChange={(value) => setForm({ ...form, dob: value })} />
            <Field label="city" value={form.city} error={errors.city} onChange={(value) => setForm({ ...form, city: value })} />
            {errors.form && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2 dark:bg-rose-950 dark:text-rose-200">{errors.form}</p>}
            <Button type="submit" className="sm:col-span-2">Save</Button>
          </form>
        </Modal>
      )}
      {deleteId && <ConfirmationDialog title="Delete Customer" message="This will remove the customer and their consultations." onCancel={() => setDeleteId(null)} onConfirm={async () => { await customerApi.remove(deleteId); showToast('Customer deleted.'); setDeleteId(null); load(); }} />}
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
