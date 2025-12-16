

// src/components/MultiSelect.jsx
import { useMemo, useState } from "react";
import { Badge, Button, Helper, Input } from "./ui";

export default function MultiSelect({
  options,       // [{id, label}]
  selectedIds,
  onChange,
  placeholder = "Select roles…",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return (options || []).filter((o) =>
      o.label.toLowerCase().includes(q)
    );
  }, [options, query]);

  function toggle(id) {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  }

  return (
    <div className="relative">
      <div
        className="flex min-h-[42px] w-full cursor-pointer flex-wrap gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:border-slate-300"
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedIds.length === 0 ? (
          <span className="text-slate-400">{placeholder}</span>
        ) : (
          selectedIds
            .map((id) => options.find((o) => o.id === id))
            .filter(Boolean)
            .map((opt) => <Badge key={opt.id}>{opt.label}</Badge>)
        )}
        <span className="ml-auto text-slate-400">▾</span>
      </div>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="p-2">
            <Input
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-auto p-2" role="listbox">
            {filtered.length === 0 && (
              <div className="px-2 py-3 text-sm text-slate-500">
                No matches
              </div>
            )}
            {filtered.map((opt) => {
              const checked = selectedSet.has(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(opt.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50 ${
                    checked ? "bg-indigo-50" : ""
                  }`}
                  role="option"
                  aria-selected={checked}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded border ${
                      checked
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {checked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 0 1 0 1.42l-7.25 7.25a1 1 0 0 1-1.414 0L3.296 9.96a1 1 0 1 1 1.414-1.414l3.04 3.04 6.543-6.543a1 1 0 0 1 1.41-.752z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-slate-800">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t p-2">
            <Helper>{selectedIds.length} selected</Helper>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onChange([])}>
                Clear
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
