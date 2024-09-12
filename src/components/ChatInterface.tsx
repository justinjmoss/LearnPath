"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import MessageList from './MessageList';
import InputField from './InputField';
import ErrorDisplay from './ErrorDisplay';
import Sidenav from './Sidenav';
import { Menu } from 'lucide-react';
import { useTheme } from '../lib/contexts/ThemeContext';
import ErrorBoundary from './ErrorBoundary';

function ChatInterface() {
  const { resolvedTheme } = useTheme();
  const [model, setModel] = useState<'openai' | 'anthropic' | 'perplexity'>('openai');
  const [error, setError] = useState<Error | null>(null);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const sidenavRef = useRef<HTMLDivElement>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error: chatError } = useChat({
    api: `/api/${model}/chat`,
    onError: (error) => {
      console.error("Chat error:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
    },
  });

  useEffect(() => {
    if (chatError) {
      setError(chatError instanceof Error ? chatError : new Error(String(chatError)));
    }
  }, [chatError]);

  useEffect(() => {
    setError(null);
  }, [model]);

  const handleModelChange = (newModel: 'openai' | 'anthropic' | 'perplexity') => {
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

  const handleRetry = () => {
    setError(null);
    setRetryCount(prevCount => prevCount + 1);
  };

  useEffect(() => {
    if (retryCount > 0) {
      handleSubmit(new Event('submit') as React.FormEvent<HTMLFormElement>);
    }
  }, [retryCount]);

  return (
    <ErrorBoundary fallback={<div className="p-4 text-red-500">Something went wrong. Please try again later.</div>}>
      <div className={`flex h-screen ${resolvedTheme === 'light' ? 'bg-light-bg text-light-text' : 'bg-dark-bg text-dark-text'}`}>
        <div ref={sidenavRef}>
          <Sidenav isOpen={isSidenavOpen} onClose={toggleSidenav} model={model} onModelChange={setModel} />
        </div>
        {isSidenavOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setIsSidenavOpen(false)}
          ></div>
        )}
        <div className="flex flex-col flex-grow">
          <div className={`flex items-center justify-between p-2 border-b ${resolvedTheme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
            <button onClick={toggleSidenav} className={resolvedTheme === 'light' ? 'text-light-text' : 'text-dark-text'}>
              <Menu size={20} />
            </button>
            <h1 className={`text-lg font-semibold absolute left-1/2 transform -translate-x-1/2 ${resolvedTheme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>AI Chat</h1>
            <div className="w-5"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-2"> {/* Reduced p-3 to p-2 */}
            <MessageList messages={messages} />
            {error && (
              <ErrorDisplay 
                error={error} 
                onRetry={handleRetry}
              />
            )}
          </div>
          <div className={`border-t ${resolvedTheme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
            <InputField
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ChatInterface;