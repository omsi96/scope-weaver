import React from 'react';
import { X, Copy, Download, FileJson, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportData: object;
  markdownData: string;
}

export function ExportModal({ isOpen, onClose, exportData, markdownData }: ExportModalProps) {
  const [copied, setCopied] = React.useState<'json' | 'md' | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = async (type: 'json' | 'md') => {
    const text = type === 'json' ? JSON.stringify(exportData, null, 2) : markdownData;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadFile = (type: 'json' | 'md') => {
    const content = type === 'json' ? JSON.stringify(exportData, null, 2) : markdownData;
    const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `requirements.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Export Requirements</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* JSON Export */}
            <div className="card-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileJson className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">JSON Format</h3>
                  <p className="text-sm text-muted-foreground">Structured data export</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard('json')}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  {copied === 'json' ? (
                    <Check className="w-4 h-4 text-accent" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied === 'json' ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => downloadFile('json')}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Markdown Export */}
            <div className="card-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Markdown Format</h3>
                  <p className="text-sm text-muted-foreground">Human-readable document</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard('md')}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  {copied === 'md' ? (
                    <Check className="w-4 h-4 text-accent" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied === 'md' ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => downloadFile('md')}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Preview (Markdown)</h3>
            <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                {markdownData.slice(0, 1500)}
                {markdownData.length > 1500 && '\n\n... (truncated)'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
