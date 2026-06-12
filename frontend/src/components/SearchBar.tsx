import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="relative block min-w-0 flex-1 group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-slate-700 dark:group-focus-within:text-slate-200" size={18} />
      <input
        className="input-surface w-full py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
