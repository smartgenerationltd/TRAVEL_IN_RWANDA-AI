import React from 'react';
import RwandaIcon from './components/icons/RwandaIcon';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
  prompts: string[];
  welcomeTitle: string;
  welcomeSubtitle: string;
  promptHeader: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick, prompts, welcomeTitle, welcomeSubtitle, promptHeader }) => {
  const colorClasses = [
    'bg-blue-500/10 text-blue-700 dark:text-blue-300 dark:bg-blue-500/20 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 border-blue-500/20 dark:border-blue-500/30',
    'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 dark:bg-yellow-500/20 hover:bg-yellow-500/20 dark:hover:bg-yellow-500/30 border-yellow-500/20 dark:border-yellow-500/30',
    'bg-green-500/10 text-green-700 dark:text-green-300 dark:bg-green-500/20 hover:bg-green-500/20 dark:hover:bg-green-500/30 border-green-500/20 dark:border-green-500/30',
  ];

  return (
    <div className="text-center py-10 px-4">
      <div className="inline-block p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
        <RwandaIcon className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{welcomeTitle}</h2>
      <p className="text-gray-300 mb-8">{welcomeSubtitle}</p>
      
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">{promptHeader}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onPromptClick(prompt)}
              className={`p-4 backdrop-blur-sm border rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${colorClasses[index % colorClasses.length]}`}
            >
              <p className="text-xl font-bold italic">{prompt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
