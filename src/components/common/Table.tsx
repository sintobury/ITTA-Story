import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

export function Table({ children, className = "", ...props }: TableProps) {
    return (
        <table className={`w-full border-collapse text-left ${className}`} {...props}>
            {children}
        </table>
    );
}

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

export function Th({ children, className = "", ...props }: ThProps) {
    return (
        <th className={`p-4 font-semibold text-[var(--secondary)] border-b border-[var(--border)] ${className}`} {...props}>
            {children}
        </th>
    );
}

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

export function Td({ children, className = "", ...props }: TdProps) {
    return (
        <td className={`p-4 border-b border-[var(--border)] ${className}`} {...props}>
            {children}
        </td>
    );
}
