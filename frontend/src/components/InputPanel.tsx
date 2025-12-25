import { Sparkles } from 'lucide-react';

interface InputPanelProps {
  language: 'ar' | 'en';
  inputText: string;
  onInputChange: (text: string) => void;
  onGenerate: (text: string) => void;
  isGenerating: boolean;
}

export function InputPanel({ language, inputText, onInputChange, onGenerate, isGenerating }: InputPanelProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onGenerate(inputText);
    }
  };

  const labels = {
    ar: {
      title: 'نص الإدخال',
      placeholder: 'اكتب النص أو الفكرة هنا...',
      generate: 'إنشاء',
      generating: 'جاري الإنشاء...',
    },
    en: {
      title: 'Input Text',
      placeholder: 'Write your text or idea here...',
      generate: 'Generate',
      generating: 'Generating...',
    },
  };

  const t = labels[language];

  return (
    <div className="bg-stone-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-stone-700/50 p-6 lg:p-8 h-fit">
      <h2 className="text-stone-100 mb-6">
        {t.title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={t.placeholder}
          className="w-full min-h-[400px] px-4 py-4 bg-stone-900/50 border border-stone-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none text-stone-100 placeholder:text-stone-500"
          style={{ 
            lineHeight: '2',
            fontSize: language === 'ar' ? '1.05rem' : '1rem',
            fontFamily: language === 'ar' ? '"Amiri", "Traditional Arabic", serif' : 'inherit',
          }}
        />

        <button
          type="submit"
          disabled={isGenerating || !inputText.trim()}
          className="w-full bg-gradient-to-l from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.generating}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.generate}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}