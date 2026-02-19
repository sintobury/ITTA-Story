import React, { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    sizeVariant?: "sm" | "md";
    fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = "", sizeVariant = "md", fullWidth = true, ...props }, ref) => {
        const baseStyles = "border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors shadow-sm placeholder:text-[var(--secondary)]/50 resize-none";

        const sizeStyles = {
            sm: "px-3 py-2 text-sm",
            md: "p-3 text-base"
        };

        const widthStyles = fullWidth ? "w-full" : "";

        return (
            <textarea
                ref={ref}
                className={`${baseStyles} ${sizeStyles[sizeVariant]} ${widthStyles} ${className}`}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";
