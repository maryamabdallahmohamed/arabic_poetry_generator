import { Feather } from 'lucide-react';

interface HeaderProps {
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="bg-stone-900/80 backdrop-blur-sm border-b border-stone-700/50 shadow-lg">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center shadow-sm">
              <Feather className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-stone-100 tracking-tight">
                {language === 'ar' ? 'مولد القصائد العربية' : 'Arabic Poem Generator'}
              </h1>
              <p className="text-xs text-stone-400">
                {language === 'ar' ? 'Arabic Poem Generator' : 'مولد القصائد العربية'}
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-stone-800 rounded-lg p-1">
            <button
              onClick={() => onLanguageChange('ar')}
              className={`px-4 py-1.5 rounded-md transition-all text-sm ${
                language === 'ar'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-stone-100'
              }`}
            >
              AR
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-4 py-1.5 rounded-md transition-all text-sm ${
                language === 'en'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-stone-100'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}