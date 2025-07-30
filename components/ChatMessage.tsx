import React from 'react';
import { Message } from '../types';
import RwandaIcon from './icons/RwandaIcon';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isModel = message.role === 'model';

  const formatContent = (content: string) => {
    // Remove the map tag so it's not displayed in the chat
    const cleanContent = content.replace(/\[MAP:.*?\]/g, '').trim();

    // Basic markdown to HTML conversion
    let html = cleanContent
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>'); // List items
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>'); // Wrap lists

    return { __html: html };
  };

  if (isModel) {
    return (
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <RwandaIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg rounded-tl-none p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            {isLoading && message.content.length === 0 ? <LoadingIndicator /> : (
                 <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={formatContent(message.content)} />
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-end space-x-4">
      <div className="flex-1 bg-blue-500 text-white rounded-lg rounded-br-none p-4 shadow-sm max-w-xl">
        <p className="text-sm">{message.content}</p>
      </div>
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
        U
      </div>
    </div>
  );
};

export default ChatMessage;
