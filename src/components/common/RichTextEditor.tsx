"use client";

import dynamic from 'next/dynamic';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Next.js에서 SSR 문제를 방지하기 위해 dynamic import 사용
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'size': ['small', false, 'large', 'huge'] }], // 글자 크기
                ['bold', 'italic', 'underline', 'strike'],        // 폰트 스타일
                [{ 'color': [] }],                                // 글자 색상
                [{ 'align': [] }],                                // 정렬
            ],
        }
    }), []);

    // [한글화] DOM 조작을 통한 툴팁 적용
    useEffect(() => {
        if (!isMounted || !containerRef.current) return;

        const applyTooltips = () => {
            const wrapper = containerRef.current;
            if (!wrapper) return;

            const tooltipMap: { [key: string]: string } = {
                '.ql-bold': '굵게',
                '.ql-italic': '기울임',
                '.ql-underline': '밑줄',
                '.ql-strike': '취소선',
                '.ql-size': '글자 크기',
                '.ql-color': '글자 색상',
                '.ql-align': '정렬',
            };

            let appliedCount = 0;
            Object.entries(tooltipMap).forEach(([selector, title]) => {
                const elements = wrapper.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element.getAttribute('data-tooltip') === title) return;

                    element.setAttribute('title', title);
                    element.setAttribute('aria-label', title);
                    element.setAttribute('data-tooltip', title);

                    appliedCount++;
                });
            });

            return appliedCount > 0;
        };

        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    shouldCheck = true;
                    break;
                }
            }
            if (shouldCheck) {
                applyTooltips();
            }
        });

        observer.observe(containerRef.current, {
            childList: true,
            subtree: true
        });

        // 초기 실행
        setTimeout(applyTooltips, 100);

        return () => observer.disconnect();
    }, [isMounted]);

    return (
        <div ref={containerRef} className="rich-text-editor-wrapper">
            <div className="editor-container prose prose-zinc max-w-none">
                {isMounted && (
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={onChange}
                        modules={modules}
                        placeholder={placeholder}
                    />
                )}
            </div>

            <style jsx global>{`
                /* --- 레이아웃 --- */
                .rich-text-editor-wrapper {
                    display: flex;
                    flex-direction: column;
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    background-color: var(--card-bg);
                    position: relative;
                }

                .ql-toolbar {
                    border-bottom: 1px solid var(--border) !important;
                    border-top: none !important;
                    border-left: none !important;
                    border-right: none !important;
                    background-color: var(--card-bg);
                    border-radius: 0.5rem 0.5rem 0 0;
                    z-index: 10;
                }
                
                .ql-container.ql-snow {
                    border: none !important;
                    min-height: 200px;
                    font-size: 1rem;
                }
                
                .ql-editor {
                    min-height: 200px; 
                    padding: 16px;
                }

                /* --- [핵심] 글자 크기 스타일 --- */
                .ql-editor .ql-size-small { font-size: 0.75em !important; }
                .ql-editor .ql-size-large { font-size: 1.5em !important; }
                .ql-editor .ql-size-huge { font-size: 2.5em !important; }

                /* --- [핵심] 아이콘 가시성 복구 --- */
                .ql-snow .ql-stroke { stroke: var(--foreground) !important; }
                .ql-snow .ql-fill { fill: var(--foreground) !important; }
                .ql-snow .ql-picker { color: var(--foreground) !important; }

                /* 호버/활성 상태 */
                .ql-snow.ql-toolbar button:hover .ql-stroke,
                .ql-snow.ql-toolbar button.ql-active .ql-stroke,
                .ql-snow .ql-picker-label:hover .ql-stroke,
                .ql-snow .ql-picker-label.ql-active .ql-stroke,
                .ql-snow .ql-picker-item:hover .ql-stroke, 
                .ql-snow .ql-picker-item.ql-selected .ql-stroke {
                    stroke: var(--primary) !important;
                }
                .ql-snow.ql-toolbar button:hover .ql-fill,
                .ql-snow.ql-toolbar button.ql-active .ql-fill,
                .ql-snow .ql-picker-label:hover .ql-fill,
                .ql-snow .ql-picker-label.ql-active .ql-fill,
                .ql-snow .ql-picker-item:hover .ql-fill, 
                .ql-snow .ql-picker-item.ql-selected .ql-fill {
                    fill: var(--primary) !important;
                }
                .ql-snow .ql-picker-label:hover,
                .ql-snow .ql-picker-label.ql-active,
                .ql-snow .ql-picker-item:hover, 
                .ql-snow .ql-picker-item.ql-selected {
                    color: var(--primary) !important;
                }

                /* --- 드롭다운 스타일 개선 --- */
                .ql-snow .ql-picker-options {
                    background-color: var(--card-bg);
                    border: 1px solid var(--border);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    border-radius: 4px;
                    z-index: 9999;
                }
                .ql-snow .ql-picker.ql-size { width: 100px; }
                
                /* 한글 툴팁 적용 (Dropdown) */
                .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before { content: '작게' !important; }
                .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before { content: '크게' !important; }
                .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before { content: '아주 크게' !important; }
                .ql-snow .ql-picker.ql-size .ql-picker-label:not([data-value])::before, .ql-snow .ql-picker.ql-size .ql-picker-item:not([data-value])::before { content: '보통' !important; }

                /* --- [신규 Feature] CSS 기반 즉시 반응형 툴팁 --- */
                /* 버튼(button) 및 드롭다운(picker) 모두 적용 */
                .ql-snow.ql-toolbar button[data-tooltip]:hover::after,
                .ql-snow.ql-toolbar .ql-picker[data-tooltip]:hover::after {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-bottom: 6px;
                    
                    background-color: #333;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 10000;
                    pointer-events: none;
                    opacity: 0;
                    animation: tooltipFadeIn 0.2s forwards;
                    font-family: var(--font-sans); /* 폰트 통일 */
                }
                
                /* 드롭다운은 position: visible인 경우가 있어서 툴팁 위치 조정 */
                .ql-snow.ql-toolbar .ql-picker[data-tooltip]:hover::after {
                    margin-bottom: 2px; /* 드롭다운은 높이가 조금 다를 수 있음 */
                }

                @keyframes tooltipFadeIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(4px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                
                .ql-snow.ql-toolbar button, .ql-snow.ql-toolbar .ql-picker {
                    position: relative;
                }
            `}</style>
        </div>
    );
}
