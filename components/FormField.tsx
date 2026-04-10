import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  children,
  className = "",
}: FormFieldProps) {
  const metaId = htmlFor ? `${htmlFor}-meta` : undefined;

  return (
    <label htmlFor={htmlFor} className={["block", className].join(" ").trim()}>
      <span className="form-label">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </span>
      {children}
      {error ? (
        <span id={metaId} className="form-error">
          {error}
        </span>
      ) : null}
      {!error && hint ? (
        <span id={metaId} className="form-hint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
