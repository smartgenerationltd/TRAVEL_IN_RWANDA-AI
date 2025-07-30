
import React from 'react';
import GoogleIcon from './icons/GoogleIcon';
import FacebookIcon from './icons/FacebookIcon';
import AppleIcon from './icons/AppleIcon';
import RwandaIcon from './icons/RwandaIcon';
import LinkedinIcon from './icons/LinkedinIcon';
import InstagramIcon from './icons/InstagramIcon';
import XSocialIcon from './icons/XSocialIcon';
import EmailIcon from './icons/EmailIcon';

type Provider = 'google' | 'facebook' | 'apple' | 'linkedin' | 'instagram' | 'x' | 'email';

interface LoginScreenProps {
  onLogin: (provider: Provider) => void;
  texts: {
    loginSubtitle: string;
    signInGoogle: string;
    signInFacebook: string;
    signInApple: string;
    signInLinkedin: string;
    signInInstagram: string;
    signInX: string;
    signInEmail: string;
    or: string;
  };
  welcomeTitle: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, texts, welcomeTitle }) => {
  const handleSocialLogin = (provider: Provider) => {
    onLogin(provider);
  };

  const socialButtonClasses = "w-full flex items-center justify-center py-3 px-4 bg-white/90 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const socialButtonTextClasses = "font-semibold text-gray-700 dark:text-gray-200";

  return (
    <div
      className="flex flex-col items-center justify-center h-screen font-sans bg-cover bg-center bg-fixed text-gray-800 dark:text-gray-200"
      style={{
        backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.6), rgba(10, 10, 10, 0.6)), linear-gradient(135deg, #00A1DE 0%, #FAD201 50%, #20603D 100%)'
      }}
    >
        <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md m-4 p-8 text-center">
            <div className="inline-block p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                <RwandaIcon className="h-16 w-16 text-green-500" />
            </div>
            <h1 id="login-title" className="text-3xl font-bold text-white mb-2">{welcomeTitle}</h1>
            <p className="text-gray-300 mt-2 mb-8">{texts.loginSubtitle}</p>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => handleSocialLogin('google')} className={socialButtonClasses}>
                        <GoogleIcon className="h-6 w-6 mr-3" />
                        <span className={socialButtonTextClasses}>{texts.signInGoogle}</span>
                    </button>
                    <button onClick={() => handleSocialLogin('facebook')} className={socialButtonClasses}>
                        <FacebookIcon className="h-6 w-6 mr-3 text-[#1877F2]" />
                        <span className={socialButtonTextClasses}>{texts.signInFacebook}</span>
                    </button>
                    <button onClick={() => handleSocialLogin('apple')} className={socialButtonClasses}>
                        <AppleIcon className="h-6 w-6 mr-3 text-gray-800 dark:text-white" />
                        <span className={socialButtonTextClasses}>{texts.signInApple}</span>
                    </button>
                    <button onClick={() => handleSocialLogin('linkedin')} className={socialButtonClasses}>
                        <LinkedinIcon className="h-6 w-6 mr-3 text-[#0A66C2]" />
                        <span className={socialButtonTextClasses}>{texts.signInLinkedin}</span>
                    </button>
                    <button onClick={() => handleSocialLogin('instagram')} className={socialButtonClasses}>
                        <InstagramIcon className="h-6 w-6 mr-3" />
                        <span className={socialButtonTextClasses}>{texts.signInInstagram}</span>
                    </button>
                    <button onClick={() => handleSocialLogin('x')} className={socialButtonClasses}>
                        <XSocialIcon className="h-6 w-6 mr-3 text-gray-800 dark:text-white" />
                        <span className={socialButtonTextClasses}>{texts.signInX}</span>
                    </button>
                </div>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-500/30"></div>
                    <span className="flex-shrink mx-4 text-gray-300 text-sm font-semibold">{texts.or}</span>
                    <div className="flex-grow border-t border-gray-500/30"></div>
                </div>

                <button onClick={() => handleSocialLogin('email')} className={socialButtonClasses}>
                    <EmailIcon className="h-6 w-6 mr-3 text-gray-600 dark:text-gray-400" />
                    <span className={socialButtonTextClasses}>{texts.signInEmail}</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default LoginScreen;
