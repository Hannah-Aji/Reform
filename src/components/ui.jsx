// src/components/ui.jsx
export const Container = ({ children }) => (
  <div className="min-h-screen bg-[#f5f0e6]">
    <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
  </div>
);

export const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-slate-300 bg-[#fdf8ec] shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle }) => (
  <div className="border-b border-slate-300/70 p-6">
    <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    {subtitle && (
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
    )}
  </div>
);

export const CardBody = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const Label = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="mb-1 block text-sm font-medium text-slate-800"
  >
    {children}
  </label>
);

export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-xl border border-slate-300 bg-[#fdf8ec] px-3 py-2 focus:border-slate-500 focus:outline-none ${className}`}
    {...props}
  />
);

export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full rounded-xl border border-slate-300 bg-[#fdf8ec] px-3 py-2 focus:border-slate-500 focus:outline-none ${className}`}
    {...props}
  />
);

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition";
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-[#fef3b4] hover:bg-black"
      : variant === "outline"
      ? "border border-slate-800 bg-transparent text-slate-900 hover:bg-slate-900 hover:text-[#fef3b4]"
      : variant === "ghost"
      ? "text-slate-900 hover:bg-slate-200/70"
      : "";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-slate-400 bg-[#fdf8ec] px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-800">
    {children}
  </span>
);

export const Helper = ({ children }) => (
  <p className="text-sm text-slate-600">{children}</p>
);
