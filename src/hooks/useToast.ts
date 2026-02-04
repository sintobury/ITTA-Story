import { useState, useCallback } from 'react';

export function useToast() {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isToastExiting, setIsToastExiting] = useState(false);

    const triggerToast = useCallback((message: string) => {
        setToastMessage(message);
        setIsToastExiting(false);

        // 2초 뒤 퇴장 애니메이션 시작
        setTimeout(() => {
            setIsToastExiting(true);
        }, 2000);

        // 2.5초 뒤 완전히 제거 (애니메이션 0.5초)
        setTimeout(() => {
            setToastMessage(null);
            setIsToastExiting(false);
        }, 2500);
    }, []);

    return {
        toastMessage,
        isToastExiting,
        triggerToast
    };
}
