import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

const controlBase =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[16px] text-charcoal placeholder:text-slate-400 transition-colors focus:border-nexus focus:outline-none focus:ring-2 focus:ring-nexus/15 disabled:bg-mist";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string | null;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="text-sm font-semibold text-navy">
          {label}
          {required ? <span className="ml-0.5 text-danger">*</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(controlBase, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlBase, "min-h-28 resize-y", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <select className={cn(controlBase, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_0.75rem_center] bg-no-repeat pr-10", className)} {...rest}>
      {children}
    </select>
  );
}

export function CheckboxField({
  label,
  description,
  className,
  ...rest
}: ComponentProps<"input"> & { label: ReactNode; description?: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white p-3.5 hover:border-accent", className)}>
      <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[#0048AC]" {...rest} />
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-slate-500">{description}</span> : null}
      </span>
    </label>
  );
}

/** Accessible radio group rendered as selectable cards. */
export function RadioCardGroup<T extends string>({
  name,
  value,
  options,
  onChange,
  className,
  columns = 3,
}: {
  name: string;
  value: T | "";
  options: { id: T; label: ReactNode }[];
  onChange: (value: T) => void;
  className?: string;
  columns?: 2 | 3 | 5;
}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 5: "sm:grid-cols-3 lg:grid-cols-5" } as const;
  return (
    <div role="radiogroup" className={cn("grid grid-cols-1 gap-2.5", cols[columns], className)}>
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <label
            key={option.id}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-3 text-sm font-medium transition-colors",
              selected
                ? "border-nexus bg-nexus-50 text-navy ring-1 ring-nexus/25"
                : "border-line bg-white text-slate-600 hover:border-accent",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={selected}
              onChange={() => onChange(option.id)}
              className="size-4 accent-[#0048AC]"
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
