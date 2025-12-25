import { Copy, FileDown } from 'lucide-react';
import { useState } from 'react';

interface PredictionPanelProps {
  language: 'ar' | 'en';
  prediction: string;
  isGenerating: boolean;
}

export function PredictionPanel({ language, prediction, isGenerating }: PredictionPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (prediction) {
      await navigator.clipboard.writeText(prediction);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (prediction) {
      const blob = new Blob([prediction], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `poem-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const labels = {
    ar: {
      title: 'النتيجة',
      empty: 'ستظهر القصيدة هنا بعد الإنشاء...',
      copy: copied ? 'تم النسخ!' : 'نسخ',
      download: 'تحميل',
    },
    en: {
      title: 'Prediction',
      empty: 'The poem will appear here after generation...',
      copy: copied ? 'Copied!' : 'Copy',
      download: 'Download',
    },
  };

  const t = labels[language];

  return (
    <div className="bg-stone-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-stone-700/50 p-6 lg:p-8 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-stone-100">
          {t.title}
        </h2>

        {prediction && !isGenerating && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-stone-700/50 hover:bg-stone-600/50 text-stone-200 rounded-lg transition-all text-sm"
              title={t.copy}
            >
              <Copy className="w-4 h-4" />
              <span>{t.copy}</span>
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-stone-700/50 hover:bg-stone-600/50 text-stone-200 rounded-lg transition-all text-sm"
              title={t.download}
            >
              <FileDown className="w-4 h-4" />
              <span>{t.download}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1">
        {isGenerating ? (
          <div className="bg-stone-900/50 border border-stone-600/50 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-amber-900/50 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-stone-400">
                {language === 'ar' ? 'جاري التوليد...' : 'Generating...'}
              </p>
            </div>
          </div>
        ) : prediction ? (
          <div 
            className="bg-gradient-to-br from-amber-950/30 to-stone-900/50 border border-amber-900/30 rounded-xl p-6 lg:p-8 min-h-[400px]"
            style={{
              direction: 'rtl',
              textAlign: 'center',
            }}
          >
            <pre 
              className="text-amber-50 whitespace-pre-wrap"
              style={{
                fontFamily: '"Amiri", "Traditional Arabic", "Scheherazade New", serif',
                lineHeight: '2.2',
                letterSpacing: '0.01em',
              }}
            >
              {prediction}
            </pre>
          </div>
        ) : (
          <div className="bg-stone-900/50 border border-stone-600/50 border-dashed rounded-xl p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-stone-500 text-center">
              {t.empty}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}