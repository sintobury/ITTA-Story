"use client";

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectProps {
    value: string | number;
    onChange: (value: string) => void; // Simplified signature: passes value directly
    options: SelectOption[];
    variant?: 'default' | 'ghost';
    className?: string; // Trigger class
    icon?: React.ReactNode;
    placeholder?: string;
    width?: string;
    align?: 'left' | 'right';
    size?: 'sm' | 'md';
}

/**
 * [Select.tsx]
 * 커스텀 셀렉트 컴포넌트입니다. (Native Select 아님)
 * - Native <option>의 스타일링 한계를 극복하기 위해 div/ul 기반으로 구현했습니다.
 * - 디자인 시스템과 일치하는 드롭다운 메뉴를 제공합니다.
 * - 'icon' prop으로 좌측 아이콘을 지원합니다.
 */
export function Select({
    value,
    onChange,
    options,
    variant = 'default',
    className = "",
    icon,
    width = "", // Default to auto width (fit content)
    align = "left",
    size = 'md',
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    // Find longest label for sizing
    const longestLabel = options.reduce((a, b) => (a.length > b.label.length ? a : b.label), "");

    // --- Styles ---
    const baseTriggerStyles = "flex items-center justify-between cursor-pointer transition-colors font-medium text-sm relative select-none disabled:opacity-50";

    const variantStyles = {
        default: "border border-[var(--border)] rounded-lg bg-[var(--background)] hover:border-[var(--primary)]",
        ghost: "bg-transparent hover:text-[var(--primary)]"
    };

    const sizeStyles = {
        sm: "p-1.5 text-sm",
        md: "p-2 text-sm",
    };

    // 아이콘이 있을 때 패딩 조정
    const paddingLeft = icon ? "pl-9" : "";
    const paddingRight = "pr-2";

    // Common classes for both Ghost and Trigger to ensure identical sizing
    const commonClass = `
        ${baseTriggerStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${paddingLeft} ${paddingRight}
        ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
        <div className={`relative inline-grid align-top ${width}`} ref={containerRef}>
            {/* Ghost Element for Width Sizing (Invisible) */}
            <div className={`${commonClass} invisible pointer-events-none col-start-1 row-start-1 h-0 overflow-hidden`}>
                {/* Icon Spacer */}
                {icon && <span className="w-4 h-4 mr-2"></span>}
                <span className="opacity-0">{longestLabel}</span>
            </div>

            {/* Actual Interactive Trigger */}
            <div
                className={`${commonClass} col-start-1 row-start-1 w-full h-full`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Left Icon (Absolute) */}
                {icon && (
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none flex items-center justify-center">
                        {icon}
                    </span>
                )}

                {/* Selected Label */}
                <span className="truncate text-[var(--foreground)] w-full text-left">
                    {selectedOption?.label}
                </span>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`absolute top-full mt-1 ${align === 'right' ? 'right-0' : 'left-0'} w-full max-h-60 overflow-auto bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-lg z-50 animate-slideDown min-w-max`}>
                    <ul>
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => {
                                    onChange(String(option.value));
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[var(--background)] transition-colors flex items-center justify-between
                                    ${option.value === value ? "text-[var(--primary)] font-bold bg-green-100" : "text-[var(--foreground)]"}
                                `}
                            >
                                <span className="truncate">{option.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
