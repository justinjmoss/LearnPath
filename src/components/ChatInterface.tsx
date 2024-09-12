"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useChat } from 'ai/react';
import { Message } from 'ai';
import MessageList from './MessageList';
import InputField from './InputField';
import ErrorDisplay from './ErrorDisplay';
import Sidenav from './Sidenav';
import { Menu } from 'lucide-react';
import { useTheme } from '../lib/contexts/ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import { useDeepgram, SOCKET_STATES } from '../lib/contexts/DeepgramContext';

function ChatInterface() {
  const { theme, setTheme } = useTheme();
  const [model, setModel] = useState<'openai' | 'anthropic' | 'perplexity'>('openai');
  const [error, setError] = useState<Error | null>(null);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const sidenavRef = useRef<HTMLDivElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const {
    connectToDeepgram,
    disconnectFromDeepgram,
    realtimeTranscript,
    connectionState,
    error: deepgramError
  } = useDeepgram();
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

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

  useEffect(() => {
    if (deepgramError) {
      setError(new Error(deepgramError));
    }
  }, [deepgramError]);

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
    if (isSidenavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidenavOpen]);

  const handleRetry = () => {
    setError(null);
    setRetryCount(prevCount => prevCount + 1);
  };

  useEffect(() => {
    if (retryCount > 0) {
      handleSubmit(new Event('submit') as React.FormEvent<HTMLFormElement>);
    }
  }, [retryCount]);

  const handleMicrophoneClick = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      try {
        await connectToDeepgram();
        setIsRecording(true);
      } catch (error) {
        console.error("Error connecting to Deepgram:", error);
        setError(new Error("Failed to start voice recording. Please try again."));
      }
    }
  };

  const stopRecording = async () => {
    disconnectFromDeepgram();
    setIsRecording(false);
    if (realtimeTranscript) {
      handleInputChange({ target: { value: realtimeTranscript } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleStopRecordingAndSubmit = async () => {
    await stopRecording();
    handleSubmit(new Event('submit') as React.FormEvent<HTMLFormElement>);
  };

  useEffect(() => {
    if (connectionState === 'closed' && isRecording) {
      setIsRecording(false);
    }
  }, [connectionState, isRecording]);

  // Remove the messagesWithLiveTranscript logic since we're not using it anymore

  return (
    <ErrorBoundary fallback={<div className="p-4 text-red-500">Something went wrong. Please try again later.</div>}>
      <div className={`flex h-screen ${theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'bg-light-bg text-light-text' : 'bg-dark-bg text-dark-text'}`}>
        <div ref={sidenavRef} className="z-30">
          <Sidenav 
            isOpen={isSidenavOpen} 
            onClose={toggleSidenav} 
            model={model} 
            onModelChange={handleModelChange}
            theme={theme}
            setTheme={setTheme}
          />
        </div>
        {isSidenavOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsSidenavOpen(false)}
          ></div>
        )}
        <div className="flex flex-col flex-grow relative">
          <div className={`flex items-center justify-between p-2 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
            {!isSidenavOpen && (
              <button 
                onClick={toggleSidenav} 
                className={`z-30 ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className={`text-lg font-semibold absolute left-1/2 transform -translate-x-1/2 ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>AI Chat</h1>
            <div className="w-5"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <MessageList 
              messages={messages} 
              isRecording={isRecording}
            />
            {error && (
              <ErrorDisplay 
                error={error} 
                onRetry={handleRetry}
              />
            )}
          </div>
          <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
            <InputField
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              onMicrophoneClick={handleMicrophoneClick}
              isRecording={isRecording}
              onStopRecordingAndSubmit={handleStopRecordingAndSubmit}
              isSidenavOpen={isSidenavOpen}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ChatInterface;