import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    required?: boolean;
    size?: "sm" | "md";
}

export function Label({ children, className = "", required, size = "md", ...props }: LabelProps) {
    const baseStyles = "block font-medium text-[var(--foreground)]";
    const sizeStyles = size === "sm" ? "text-sm mb-1" : "text-base mb-2";

    return (
        <label className={`${baseStyles} ${sizeStyles} ${className}`} {...props}>
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
}
