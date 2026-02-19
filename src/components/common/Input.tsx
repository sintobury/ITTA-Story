import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    sizeVariant?: "sm" | "md"; // 'size' is a native prop, so using 'sizeVariant'
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", sizeVariant = "md", fullWidth = true, ...props }, ref) => {
        const baseStyles = "border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors shadow-sm placeholder:text-[var(--secondary)]/50";

        const sizeStyles = {
            sm: "px-3 py-2 text-sm",
            md: "p-3 text-base"
        };

        const widthStyles = fullWidth ? "w-full" : "";

        return (
            <input
                ref={ref}
                className={`${baseStyles} ${sizeStyles[sizeVariant]} ${widthStyles} ${className}`}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";
