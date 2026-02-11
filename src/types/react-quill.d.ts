declare module 'react-quill-new' {
    import React from 'react';
    export interface ReactQuillProps {
        theme?: string;
        value?: string;
        defaultValue?: string;
        onChange?: (value: string, delta: any, source: any, editor: any) => void;
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
