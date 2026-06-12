import { Edit, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import { TableSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import { astrologerApi } from '../services/api';
import { Astrologer, FormErrors } from '../types';
import { mergeErrors, validateEmailPhone, validateRequired } from '../utils/validation';

const blank = { name: '', specialization: '', experience: 1, languages: '', rating: 5, phone: '', email: '', status: 'Active' };

export default function Astrologers() {
  const [items, setItems] = useState<Astrologer[]>([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Astrologer | null>(null);
  const [form, setForm] = useState<Omit<Astrologer, 'id'>>(blank);
  const [errors, setErrors] = useState<FormErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const specializations = useMemo(() => [...new Set(items.map((item) => item.specialization))], [items]);
  const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) && (!specialization || item.specialization === specialization));

  function load() {
    setLoading(true);
    astrologerApi.list().then((response) => setItems(response.items)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openForm(item?: Astrologer) {
    setErrors({});
    setEditing(item || null);
    setForm(item ? { ...item } : blank);
    setFormOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = mergeErrors(validateRequired(form, Object.keys(blank)));
    validateEmailPhone(form, nextErrors);
    if (Number(form.experience) <= 0) nextErrors.experience = 'Experience must be positive.';
    if (Number(form.rating) < 1 || Number(form.rating) > 5) nextErrors.rating = 'Rating must be 1 to 5.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      editing ? await astrologerApi.update(editing.id, form) : await astrologerApi.create(form);
      showToast(editing ? 'Astrologer updated.' : 'Astrologer created.');
      setFormOpen(false);
      load();
    } catch (error: any) {
      setErrors(error.response?.data?.errors || { form: 'Unable to save astrologer.' });
    }
  }

  return (
    <CrudFrame title="Astrologers" onAdd={() => openForm()} search={search} setSearch={setSearch}>
      <select className="input-surface px-3 py-2 text-sm shadow-sm" value={specialization} onChange={(event) => setSpecialization(event.target.value)}>
        <option value="">All specializations</option>
        {specializations.map((item) => <option key={item}>{item}</option>)}
      </select>
      {loading ? <TableSkeleton /> : (
        <DataTable<Astrologer>
          data={filtered}
          columns={[
            { key: 'name', header: 'Name', sortable: true },
            { key: 'specialization', header: 'Specialization', sortable: true },
            { key: 'experience', header: 'Exp.', sortable: true },
            { key: 'languages', header: 'Languages' },
            { key: 'rating', header: 'Rating', sortable: true },
            { key: 'status', header: 'Status' },
          ]}
          actions={(row) => <RowActions onEdit={() => openForm(row)} onDelete={() => setDeleteId(row.id)} />}
        />
      )}
      {formOpen && (
        <Modal title={editing ? 'Edit Astrologer' : 'Add Astrologer'} onClose={() => setFormOpen(false)}>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {(['name', 'specialization', 'languages', 'phone', 'email', 'status'] as const).map((field) => <Field key={field} label={field} value={form[field]} error={errors[field]} onChange={(value) => setForm({ ...form, [field]: value })} />)}
            <Field label="experience" type="number" value={form.experience} error={errors.experience} onChange={(value) => setForm({ ...form, experience: Number(value) })} />
            <Field label="rating" type="number" value={form.rating} error={errors.rating} onChange={(value) => setForm({ ...form, rating: Number(value) })} />
            {errors.form && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2 dark:bg-rose-950 dark:text-rose-200">{errors.form}</p>}
            <Button type="submit" className="sm:col-span-2">Save</Button>
          </form>
        </Modal>
      )}
      {deleteId && <ConfirmationDialog title="Delete Astrologer" message="This will remove the astrologer and their consultations." onCancel={() => setDeleteId(null)} onConfirm={async () => { await astrologerApi.remove(deleteId); showToast('Astrologer deleted.'); setDeleteId(null); load(); }} />}
    </CrudFrame>
  );
}

function CrudFrame({ title, onAdd, search, setSearch, children }: any) {
  return <div className="space-y-4"><PageHeader title={title} description="Manage astrologer profiles, availability signals, and specialties." actions={<Button onClick={onAdd}><Plus size={18} /> Add</Button>} /><div className="flex flex-col gap-3 sm:flex-row"><SearchBar value={search} onChange={setSearch} placeholder={`Search ${title.toLowerCase()}...`} />{children[0]}</div>{children.slice(1)}</div>;
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return <div className="flex justify-end gap-2"><Button variant="outline" className="min-h-9 px-3" onClick={onEdit}><Edit size={16} /></Button><Button variant="outline" className="min-h-9 px-3 text-rose-600 hover:text-rose-700" onClick={onDelete}><Trash2 size={16} /></Button></div>;
}

function Field({ label, value, onChange, error, type = 'text' }: { label: string; value: string | number; onChange: (value: string) => void; error?: string; type?: string }) {
  return (
    <label className="block text-sm font-medium capitalize text-slate-900 dark:text-slate-100">
      {label.replace('_', ' ')}
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
