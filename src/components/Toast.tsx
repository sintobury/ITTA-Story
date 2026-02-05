import React from 'react';

interface ToastProps {
    message: string | null;
    isExiting: boolean;
}

export default function Toast({ message, isExiting }: ToastProps) {
    if (!message) return null;

    return (
        <div className={`
            fixed bottom-8 right-8 
            bg-[#333] text-white 
            px-6 py-4 rounded-lg 
            shadow-[0_4px_12px_rgba(0,0,0,0.15)] 
            z-[2000] 
            flex items-center gap-2
            ${isExiting ? 'animate-fadeOut' : 'animate-slideUpFade'}
        `}>
            {message}
        </div>
    );
}
