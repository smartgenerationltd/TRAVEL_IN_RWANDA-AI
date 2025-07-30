
import React from 'react';
import GoogleIcon from './icons/GoogleIcon';
import FacebookIcon from './icons/FacebookIcon';
import AppleIcon from './icons/AppleIcon';
import XIcon from './icons/XIcon';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (provider: 'google' | 'facebook' | 'apple') => void;
  texts: {
    loginTitle: string;
    loginSubtitle: string;
    signInGoogle: string;
    signInFacebook: string;
    signInApple: string;
  };
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, texts }) => {
  if (!isOpen) return null;

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'apple') => {
    onLogin(provider);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-8 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="Close">
            <XIcon className="h-6 w-6" />
          </button>
          
          <h2 id="login-title" className="text-2xl font-bold text-gray-900 dark:text-white">{texts.loginTitle}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">{texts.loginSubtitle}</p>

          <div className="space-y-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center py-3 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <GoogleIcon className="h-6 w-6 mr-3" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">{texts.signInGoogle}</span>
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full flex items-center justify-center py-3 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FacebookIcon className="h-6 w-6 mr-3 text-[#1877F2]" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">{texts.signInFacebook}</span>
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              className="w-full flex items-center justify-center py-3 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <AppleIcon className="h-6 w-6 mr-3 text-gray-800 dark:text-white" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">{texts.signInApple}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
