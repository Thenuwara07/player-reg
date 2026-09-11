import * as React from "react";

type Association = {
  id: number;
  name: string;
  code: string;
};

type Props = {
  value: string;
  onChange: (val: string) => void;
  associations: Association[];
  placeholder?: string;
  onOpenType?: () => void;
  className?: string;
  onChangeDetailed?: (sel: { id: number | null; name: string; code: string }) => void;
};

export default function SearchableFreeTextClubInput({
  value,
  onChange,
  associations,
  placeholder = "Type association…",
  onOpenType,
  className = "",
  onChangeDetailed,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Ensure associations is always an array and value is a string before filtering
  const filtered = React.useMemo(() => {
    const q = (value || "").trim().toLowerCase();
    if (!q) return (associations || []).slice(0, 25); // Default to empty array if associations is null or undefined
    return (associations || [])
      .filter((a) => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q))
      .slice(0, 25);
  }, [value, associations]);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const emitSelection = (assoc: Association) => {
    onChange(assoc.name);
    onChangeDetailed?.({ id: assoc.id, name: assoc.name, code: assoc.code });
  };

  const commitSelection = (sel: Association) => {
    emitSelection(sel);
    setOpen(false);
    setActiveIndex(-1);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => {
        const next = i + 1;
        const bound = filtered.length - 1;
        return next > bound ? bound : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? -1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        commitSelection(filtered[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          onOpenType?.();
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
        spellCheck={false}
      />

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow">
          {filtered.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {filtered.map((a, idx) => (
                <li
                  key={a.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commitSelection(a)}
                  className={`px-3 py-2 cursor-pointer ${
                    idx === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium">{a.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({a.code})</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-2 text-gray-600">No matches found.</div>
          )}
        </div>
      )}
    </div>
  );
}
