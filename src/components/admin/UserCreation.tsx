import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { Button } from "@/components/common/Button";
import { Label } from "@/components/common/Label";
import { Input } from "@/components/common/Input";
import { supabase } from "@/lib/supabase";

export default function UserCreation() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [idMessage, setIdMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const { t } = useLanguage();
    const { toastMessage, isToastExiting, triggerToast } = useToast();

    const handleCheckDuplicate = async () => {
        if (!id) return;

        try {
            // RPC로 유저중복 여부 확인
            // Supabase의 'check_email_exists' RPC 함수를 호출합니다.
            const { data: exists, error } = await supabase.rpc('check_email_exists', {
                email_input: `${id}@example.com`
            });

            if (error) {
                console.error("Duplicate check error:", error);
                // RPC가 없거나 실패한 경우, 안전하게 실패 처리하거나 경고
                triggerToast(t.admin.checkError || "중복 확인 중 오류가 발생했습니다.");
                return;
            }

            if (exists) {
                setIdMessage({ text: t.auth.idTaken, type: 'error' });
                setIsIdChecked(false);
            } else {
                setIdMessage({ text: t.auth.idAvailable, type: 'success' });
                setIsIdChecked(true);
            }
        } catch (err) {
            console.error(err);
            triggerToast("중복 확인 실패");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isIdChecked) {
            alert(t.auth.checkIdFirst);
            return;
        }

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: `${id}@example.com`, // 아이디를 이메일 형식으로 변환 (가정)
                    password,
                    nickname
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create user');
            }

            triggerToast(`유저 '${nickname}' (${id}) 생성이 완료되었습니다.`);

            // 폼 초기화
            setId("");
            setPassword("");
            setNickname("");
            setIsIdChecked(false);
            setIdMessage(null);

        } catch (error) {
            console.error('Error creating user:', error);
            if (error instanceof Error) {
                triggerToast(`오류 발생: ${error.message}`);
            } else {
                triggerToast('알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--card-shadow)] border border-[var(--border)] max-w-md mx-auto mt-8 animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 text-[var(--foreground)]">새 회원 생성 (관리자 전용)</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <Label>{t.auth.id}</Label>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={id}
                            onChange={(e) => {
                                setId(e.target.value);
                                setIsIdChecked(false);
                                setIdMessage(null);
                            }}
                            placeholder={t.auth.idPlaceholder}
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
                    <Label>{t.auth.password}</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.auth.pwPlaceholder}
                        required
                    />
                </div>

                <div className="mb-6">
                    <Label>{t.auth.nickname}</Label>
                    <Input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder={t.auth.nickPlaceholder}
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
