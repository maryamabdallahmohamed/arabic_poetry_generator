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
    <div className="min-h-screen bg-gray-100">
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto p-4">
        <InputPanel
          language={language}
          inputText={inputText}
          onInputChange={setInputText}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
        <PredictionPanel 
          language={language} 
          prediction={prediction} 
          isGenerating={isGenerating} 
        />
      </main>
    </div>
  );
}