import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { Button } from "@/components/common/Button";

export default function UserCreation() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [idMessage, setIdMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const { t } = useLanguage();
    const { toastMessage, isToastExiting, triggerToast } = useToast();

    const handleCheckDuplicate = () => {
        if (!id) return;

        // [클라 확인용] 중복 확인 목업 로직
        if (id === "admin" || id === "user") {
            setIdMessage({ text: t.auth.idTaken, type: 'error' });
            setIsIdChecked(false);
        } else {
            setIdMessage({ text: t.auth.idAvailable, type: 'success' });
            setIsIdChecked(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isIdChecked) {
            alert(t.auth.checkIdFirst);
            return;
        }

        // [클라 확인용] 목업 회원가입 로직
        console.log(`Creating user: ${id}, ${nickname}`);
        triggerToast(`유저 '${nickname}' (${id}) 생성이 완료되었습니다.`);

        // Reset form
        setId("");
        setPassword("");
        setNickname("");
        setIsIdChecked(false);
        setIdMessage(null);
    };

    return (
        <div className="bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)] border border-[var(--border)] max-w-md mx-auto mt-8 animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 text-[var(--foreground)]">새 회원 생성 (관리자 전용)</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-[var(--foreground)]">{t.auth.id}</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => {
                                setId(e.target.value);
                                setIsIdChecked(false);
                                setIdMessage(null);
                            }}
                            placeholder={t.auth.idPlaceholder}
                            className="w-full p-3 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-base focus:outline-none focus:border-[var(--primary)] transition-colors"
                            required
                        />
                        <Button
                            type="button"
                            onClick={handleCheckDuplicate}
                            variant="secondary"
                            className="whitespace-nowrap font-medium"
                        >
                            {t.auth.checkDuplicate}
                        </Button>
                    </div>
                    {idMessage && (
                        <p className={`text-sm mt-1.5 ${idMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {idMessage.text}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-[var(--foreground)]">{t.auth.password}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.auth.pwPlaceholder}
                        className="w-full p-3 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-base focus:outline-none focus:border-[var(--primary)] transition-colors"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-[var(--foreground)]">{t.auth.nickname}</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder={t.auth.nickPlaceholder}
                        className="w-full p-3 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-base focus:outline-none focus:border-[var(--primary)] transition-colors"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    className="mt-4 font-semibold shadow-md hover:shadow-lg"
                >
                    회원 생성하기
                </Button>
            </form>

            <Toast message={toastMessage} isExiting={isToastExiting} />
        </div>
    );
}
