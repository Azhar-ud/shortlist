import clsx from "clsx";
import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

interface FieldProps {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, htmlFor, children, className }: FieldProps) {
  return (
    <label htmlFor={htmlFor} className={clsx("flex flex-col gap-2", className)}>
      <span className="flex items-center justify-between text-[12px] font-medium text-ink">
        <span>{label}</span>
        {hint ? (
          <span className="font-mono text-[11px] font-normal text-ink-dim">
            {hint}
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

const BASE =
  "w-full rounded-[10px] border border-border bg-bg-card px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition-all duration-150 placeholder:text-ink-faint focus:border-ink focus:shadow-[0_0_0_4px_oklch(85%_0.018_250/0.35)]";

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} className={clsx(BASE, className)} />;
}

export function Textarea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      className={clsx(BASE, "leading-relaxed resize-y", className)}
    />
  );
}
