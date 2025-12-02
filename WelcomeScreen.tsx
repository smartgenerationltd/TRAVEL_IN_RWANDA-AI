
import React from 'react';
import RwandaIcon from './components/icons/RwandaIcon';

interface WelcomeScreenProps {
  welcomeTitle: string;
  welcomeSubtitle: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ welcomeTitle, welcomeSubtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="inline-block p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
        <RwandaIcon className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-3xl font-bold italic text-green-300 mb-2">{welcomeTitle}</h2>
      <p className="max-w-lg font-bold italic text-green-300">{welcomeSubtitle}</p>
    </div>
  );
};

export default WelcomeScreen;
