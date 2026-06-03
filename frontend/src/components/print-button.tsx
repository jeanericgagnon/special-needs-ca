'use client';

import { Printer } from 'lucide-react';

interface PrintButtonProps {
  label?: string;
  style?: React.CSSProperties;
}

export default function PrintButton({ label = 'Print / Save PDF Action Plan', style }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      type="button"
      className="btn-primary no-print"
      style={{
        background: 'var(--primary-color)',
        color: 'white',
        width: 'auto',
        padding: '0.6rem 1.25rem',
        fontSize: '0.88rem',
        borderRadius: '10px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.1)',
        cursor: 'pointer',
        border: 'none',
        fontWeight: 600,
        ...style
      }}
    >
      <Printer size={16} />
      <span>{label}</span>
    </button>
  );
}
