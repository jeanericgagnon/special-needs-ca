'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function CopyButton({ text, size = 13, className, style }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.2rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: copied ? '#10b981' : 'var(--text-light)',
        transition: 'color 0.2s ease',
        verticalAlign: 'middle',
        ...style
      }}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
    </button>
  );
}
