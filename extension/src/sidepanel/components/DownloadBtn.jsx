import React from 'react';
import { downloadPDF } from '../../utils/pdfGenerator';

export default function DownloadBtn({ content }) {
  return (
    <button 
      onClick={() => downloadPDF(content)}
      style={{ fontSize: '10px', padding: '2px 5px', marginTop: '5px' }}
    >
      📥 Download PDF
    </button>
  );
}