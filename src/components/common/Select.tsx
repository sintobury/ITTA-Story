"use client";

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectProps {
    value: string | number;
    onChange: (value: string) => void; // 단순화된 서명: 값을 직접 전달
    options: SelectOption[];
    variant?: 'default' | 'ghost';
    className?: string; // 트리거 클래스
    icon?: React.ReactNode;
    placeholder?: string;
    width?: string;
    align?: 'left' | 'right';
    alignText?: 'left' | 'center';
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
    width = "", // 기본값: 자동 너비 (내용에 맞게)
    align = "left",
    alignText = "left",
    size = 'md',
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 핸들러 (Click outside handler)
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

    // 사이징을 위해 가장 긴 라벨 찾기
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

    // 고스트와 트리거의 크기를 일치시키기 위한 공통 클래스
    const commonClass = `
        ${baseTriggerStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${paddingLeft} ${paddingRight}
        ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
        <div className={`relative inline-grid align-top ${width}`} ref={containerRef}>
            {/* 너비 계산을 위한 고스트 엘리먼트 (보이지 않음) */}
            <div className={`${commonClass} invisible pointer-events-none col-start-1 row-start-1 h-0 overflow-hidden`}>
                {/* 아이콘 공간 */}
                {icon && <span className="w-4 h-4 mr-2"></span>}
                <span className="opacity-0">{longestLabel}</span>
            </div>

            {/* 실제 인터랙티브 트리거 */}
            <div
                className={`${commonClass} col-start-1 row-start-1 w-full h-full`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* 왼쪽 아이콘 (절대 위치) */}
                {icon && (
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none flex items-center justify-center">
                        {icon}
                    </span>
                )}

                {/* 선택된 라벨 */}
                <span className={`truncate text-[var(--foreground)] w-full ${alignText === 'center' ? 'text-center' : 'text-left'}`}>
                    {selectedOption?.label}
                </span>
            </div>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
                <div className={`absolute top-full mt-1 ${align === 'right' ? 'right-0' : 'left-0'} w-full max-h-60 overflow-auto bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-lg z-50 animate-slideDown`}>
                    <ul>
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => {
                                    onChange(String(option.value));
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[var(--background)] transition-colors flex items-center
                                    ${alignText === 'center' ? 'justify-center' : 'justify-start'}
                                    ${option.value === value ? "text-[var(--primary)] font-bold bg-green-100" : "text-[var(--foreground)]"}
                                `}
                            >
                                <span className={`truncate w-full ${alignText === 'center' ? 'text-center' : 'text-left'}`}>{option.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
