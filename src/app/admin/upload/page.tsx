/**
 * [admin/upload/page.tsx]
 * 새 책을 등록하는 페이지입니다. (관리자 전용)
 * - BookForm 컴포넌트를 사용하여 책 정보와 페이지 내용을 입력받습니다.
 */
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BookForm from "@/components/BookForm";
import styles from "./page.module.css";

export default function UploadPage() {
    const { user } = useAuth();

    if (!user || user.role !== 'ADMIN') {
        return <div className={styles.container}>Access Denied</div>;
    }

    return (
        <div className={styles.container}>
            <BookForm mode="create" />
        </div>
    );
}
