import React from 'react';

const ChatMessage = ({ message, isUser, timestamp }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
      <div className={`max-w-3xl ${
        isUser 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
          : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
        } rounded-2xl px-5 py-3.5 transition-all duration-200 hover:shadow-md`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;