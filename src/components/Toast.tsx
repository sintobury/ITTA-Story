import React from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string | null;
    isExiting: boolean;
}

export default function Toast({ message, isExiting }: ToastProps) {
    if (!message) return null;

    return (
        <div className={`${styles.toast} ${isExiting ? styles.toastExiting : ''}`}>
            {message}
        </div>
    );
}
