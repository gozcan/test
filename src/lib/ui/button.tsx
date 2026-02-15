import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      style={{
        backgroundColor: "#0ea5e9",
        color: "white",
        border: "none",
        borderRadius: 10,
        padding: "10px 16px",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
