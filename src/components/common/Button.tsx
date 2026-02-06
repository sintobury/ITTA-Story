import React, { ButtonHTMLAttributes } from 'react';

// 버튼 변형(Variant) 정의
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * [Button.tsx]
 * 공통 버튼 컴포넌트입니다.
 * - 다양한 스타일(primary, secondary 등)과 크기(sm, md, lg)를 지원합니다.
 * - 로딩 상태 및 아이콘 배치를 지원합니다.
 */
export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    className = '',
    leftIcon,
    rightIcon,
    disabled,
    ...props
}: ButtonProps) {
    // 1. 기본 스타일
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    // 2. 변형(Variant) 스타일
    const variants = {
        primary: "bg-[var(--primary)] text-white shadow-sm hover:brightness-110 border border-transparent",
        secondary: "bg-[var(--card-bg)] text-[var(--secondary)] border border-[var(--border)] hover:text-[var(--primary)] hover:bg-[var(--background)]",
        danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
        ghost: "bg-transparent text-[var(--secondary)] hover:text-[var(--primary)] hover:bg-[var(--background)]",
        outline: "bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
    };

    // 3. 크기(Size) 스타일
    const sizes = {
        sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
        md: "text-sm px-4 py-2 h-10 gap-2",
        lg: "text-base px-6 py-3 h-12 gap-2.5"
    };

    // 4. 너비 스타일
    const widthStyle = fullWidth ? "w-full" : "";

    // 클래스 조합
    const computedClassName = `
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthStyle}
        ${className}
    `.replace(/\s+/g, ' ').trim(); // 불필요한 공백 제거

    return (
        <button
            className={computedClassName}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!isLoading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </button>
    );
}
