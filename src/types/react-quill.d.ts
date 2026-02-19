declare module 'react-quill-new' {
    import React from 'react';
    export interface ReactQuillProps {
        theme?: string;
        value?: string;
        defaultValue?: string;
        /** 
         * Quill 에디터의 Delta 및 Source 객체 타입이 복잡하여, 
         * 유연한 사용을 위해 부득이하게 any 타입을 허용합니다.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange?: (value: string, delta: any, source: any, editor: any) => void;
        /** 
         * 다양한 커스텀 모듈(Toolbar 등) 설정을 지원하기 위해 any 타입을 허용합니다. 
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        modules?: any;
        formats?: string[];
        placeholder?: string;
        className?: string;
        children?: React.ReactNode;
        readOnly?: boolean;
        preserveWhitespace?: boolean;
        bounds?: string | HTMLElement;
        scrollingContainer?: string | HTMLElement;
        tabIndex?: number;
    }
    const ReactQuill: React.FC<ReactQuillProps>;
    export default ReactQuill;
}
