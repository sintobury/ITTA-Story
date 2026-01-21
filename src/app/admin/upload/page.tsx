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
