import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./Button.css";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "soft";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({
  children,
  variant = "secondary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}