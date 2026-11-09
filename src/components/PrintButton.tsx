'use client';

/**
 * Download as PDF: opens the browser's print dialog, where the print stylesheet in globals.css lays the page out
 * as a document and the browser saves it as a PDF. No server, no build-time renderer.
 */
export default function PrintButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={`no-print ${className ?? ''}`}>
      {label}
    </button>
  );
}
