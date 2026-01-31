import { useEffect, useRef } from 'react';

/**
 * Component hiển thị công thức hóa học với KaTeX/MathJax
 * Input: HTML content có thể chứa công thức LaTeX (ví dụ: $H_2SO_4$ hoặc $$x = \frac{-b}{2a}$$)
 */
const MathRenderer = ({ content, inline = false }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && window.MathJax) {
            // Reset và render lại MathJax
            window.MathJax.contentDocument = document;
            window.MathJax.typesetPromise?.([containerRef.current])
                .catch(err => console.error('MathJax render error:', err));
        }
    }, [content]);

    return (
        <div
            ref={containerRef}
            dangerouslySetInnerHTML={{ __html: content }}
            className={inline ? 'math-inline' : 'math-block'}
            style={{
                wordWrap: 'break-word',
                overflow: 'auto',
                padding: inline ? '2px 4px' : '8px 12px',
                borderRadius: '4px',
                backgroundColor: inline ? 'transparent' : '#f5f5f5',
            }}
        />
    );
};

export default MathRenderer;
