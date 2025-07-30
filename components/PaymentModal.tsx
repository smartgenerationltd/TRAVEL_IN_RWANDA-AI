
import React, { useState } from 'react';
import XIcon from './icons/XIcon';
import CrownIcon from './icons/CrownIcon';
import MobileMoneyIcon from './icons/MobileMoneyIcon';
import BankIcon from './icons/BankIcon';
import CopyIcon from './icons/CopyIcon';

interface PaymentModalProps {
  onClose: () => void;
  onUpgrade: () => void;
  texts: {
    paymentTitle: string;
    paymentSubtitle: string;
    howToUpgrade: string;
    premiumPrice: string;
    payWithMomo: string;
    payWithBank: string;
    paymentConfirmation: string;
    copy: string;
    copied: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onUpgrade, texts }) => {
  const [copied, setCopied] = useState<'momo' | 'bank' | null>(null);

  const copyToClipboard = (text: string, type: 'momo' | 'bank') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <XIcon className="h-6 w-6" />
          </button>
          
          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/50 mb-4`}>
                <CrownIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <h2 id="payment-title" className="text-2xl font-bold text-gray-900 dark:text-white">{texts.paymentTitle}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">{texts.paymentSubtitle}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300">{texts.howToUpgrade}</h3>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 text-center p-4 rounded-lg">
                <p className="font-semibold text-blue-800 dark:text-blue-200">{texts.premiumPrice}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MoMoPay Card */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <MobileMoneyIcon className="h-8 w-8 mr-3 text-yellow-500" />
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">{texts.payWithMomo}</h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">MoMoPay Code:</p>
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-md">
                  <code className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">431314</code>
                  <button
                    onClick={() => copyToClipboard('431314', 'momo')}
                    className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <CopyIcon className="h-5 w-5" />
                    <span>{copied === 'momo' ? texts.copied : texts.copy}</span>
                  </button>
                </div>
              </div>

              {/* Equity Bank Card */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <BankIcon className="h-8 w-8 mr-3 text-blue-500" />
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">{texts.payWithBank}</h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Account #:</p>
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-md">
                  <code className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">4002112036354</code>
                  <button
                    onClick={() => copyToClipboard('4002112036354', 'bank')}
                    className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <CopyIcon className="h-5 w-5" />
                    <span>{copied === 'bank' ? texts.copied : texts.copy}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={onUpgrade}
                className="w-full py-3 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
              >
                {texts.paymentConfirmation}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
