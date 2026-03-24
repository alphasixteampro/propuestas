import { FileDown, Loader2 } from 'lucide-react';
import { usePDF } from '../hooks/usePDF';

interface PDFButtonProps {
  filename?: string;
  elementId?: string;
  label?: string;
  className?: string;
}

export default function PDFButton({
  filename = 'propuesta-sixteam.pdf',
  elementId,
  label = 'Descargar PDF',
  className = '',
}: PDFButtonProps) {
  const { exportPDF, generating, progress } = usePDF();

  return (
    <button
      onClick={() => exportPDF({ filename, elementId })}
      disabled={generating}
      className={`no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-poppins transition-all ${className}`}
      style={{
        background: generating
          ? 'rgba(0,191,165,.15)'
          : 'linear-gradient(90deg, #1d70a2, #00bfa5)',
        color: '#fff',
        border: generating ? '1px solid rgba(0,191,165,.3)' : 'none',
        boxShadow: generating ? 'none' : '0 4px 20px rgba(0,191,165,.25)',
        cursor: generating ? 'not-allowed' : 'pointer',
        minWidth: 160,
      }}
    >
      {generating ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          <span>{progress < 100 ? `${progress}%` : 'Listo'}</span>
        </>
      ) : (
        <>
          <FileDown size={15} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
