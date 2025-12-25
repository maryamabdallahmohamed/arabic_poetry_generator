import { useState } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { PredictionPanel } from './components/PredictionPanel';

export default function App() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [inputText, setInputText] = useState('');
  const [prediction, setPrediction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (text: string) => {
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          max_new_tokens: 50,
          temperature: 0.7,
          top_k: 10,
          repetition_penalty: 1.2,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prediction');
      }

      const data = await response.json();
      setPrediction(data.generated_text);
    } catch (error) {
      console.error('Error generating prediction:', error);
      setPrediction('An error occurred while generating the prediction.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-gradient">
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-6 max-w-7xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Prediction, Right: Input — matches reference */}
          <PredictionPanel 
            language={language} 
            prediction={prediction} 
            isGenerating={isGenerating} 
          />
          <InputPanel
            language={language}
            inputText={inputText}
            onInputChange={setInputText}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
      </main>
    </div>
  );
}