import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export function Button({ children, className = "", variant = "primary", ...props }: Props) {
  return (
    <button className={`ui-button ${variant} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  );
}
