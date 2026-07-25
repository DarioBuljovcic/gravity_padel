export function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="font-display text-3xl font-black uppercase text-white md:text-5xl">{title}</h1>
      <p className="mt-2 text-slate-400">{subtitle}</p>
    </div>
  );
}

export function Back({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-6 w-full text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white disabled:opacity-50"
    >
      Nazad
    </button>
  );
}

export function ContactInput({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-4 text-base font-medium normal-case tracking-normal text-white outline-none focus:border-padel-blue"
      />
    </label>
  );
}

export const stepButtonClass =
  "rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-left text-white transition hover:border-padel-blue/60 hover:bg-slate-900";
