"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import MessageList from './MessageList';
import InputField from './InputField';
import ErrorDisplay from './ErrorDisplay';
import Sidenav from './Sidenav';
import { Menu } from 'lucide-react';
import { useTheme } from '../lib/contexts/ThemeContext';

function ChatInterface() {
  const { theme } = useTheme();
  const [model, setModel] = useState<'openai' | 'anthropic'>('openai');
  const [error, setError] = useState<Error | null>(null);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const sidenavRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/${model}/chat`,
    onError: (error) => {
      console.error("Chat error:", error);
      setError(error);
    },
  });

  useEffect(() => {
    setError(null);
  }, [model]);

  const handleModelChange = (newModel: 'openai' | 'anthropic') => {
    setModel(newModel);
  };

  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (sidenavRef.current && !sidenavRef.current.contains(event.target as Node)) {
      setIsSidenavOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`flex h-screen ${theme === 'light' ? 'bg-light-bg text-light-text' : 'bg-dark-bg text-dark-text'}`}>
      <div ref={sidenavRef}>
        <Sidenav isOpen={isSidenavOpen} onClose={toggleSidenav} model={model} onModelChange={handleModelChange} />
      </div>
      {isSidenavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidenavOpen(false)}
        ></div>
      )}
      <div className="flex flex-col flex-grow">
        <div className={`flex items-center justify-between p-2 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
          <button onClick={toggleSidenav} className={theme === 'light' ? 'text-light-text' : 'text-dark-text'}>
            <Menu size={20} />
          </button>
          <h1 className={`text-lg font-semibold absolute left-1/2 transform -translate-x-1/2 ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>AI Chat</h1>
          <div className="w-5"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-2"> {/* Reduced p-3 to p-2 */}
          <MessageList messages={messages} />
          {error && <ErrorDisplay error={error} />}
        </div>
        <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
          <InputField
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;