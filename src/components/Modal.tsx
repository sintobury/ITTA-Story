import React, { ReactNode } from 'react';
import styles from './Modal.module.css';

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
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    {title}
                </div>
                <div className={styles.modalContent}>
                    {children}
                </div>
                {footer && (
                    <div className={styles.modalActions}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
