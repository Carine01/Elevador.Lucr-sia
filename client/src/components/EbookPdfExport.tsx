import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface EbookPdfExportProps {
  ebookId: number;
  title: string;
}

export function EbookPdfExport({ ebookId, title }: EbookPdfExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportMutation = trpc.content.exportEbookPdf.useMutation({
    onSuccess: (data) => {
      // Converter base64 para Blob de forma eficiente
      const byteCharacters = atob(data.data);
      const byteArray = Uint8Array.from(byteCharacters, (char) => char.charCodeAt(0));
      const blob = new Blob([byteArray], { type: data.mimeType });
      
      // Criar link de download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF exportado com sucesso!');
      setIsExporting(false);
    },
    onError: (error) => {
      toast.error('Erro ao exportar PDF', {
        description: error.message,
      });
      setIsExporting(false);
    },
  });

  const handleExport = () => {
    setIsExporting(true);
    exportMutation.mutate({ ebookId });
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {isExporting ? 'Exportando...' : 'Exportar PDF'}
    </Button>
  );
}
