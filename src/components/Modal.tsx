import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    title: string | ReactNode;
    children: ReactNode;
    footer?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-[var(--card-bg,white)] p-8 rounded-xl w-[90%] max-w-[450px] shadow-[0_10px_25px_rgba(0,0,0,0.2)] animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 text-[var(--foreground,#333)] text-xl font-bold border-b-2 border-[var(--border,#eee)] pb-3">
                    {title}
                </div>
                <div className="mb-8 text-[var(--foreground,#333)]">
                    {children}
                </div>
                {footer && (
                    <div className="flex gap-3 justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
