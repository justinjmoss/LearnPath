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
  const recorderRef = useRef<MediaRecorder | null>(null);

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
      handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
    }
  }, [retryCount]);

  const handleMicrophoneClick = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      try {
        if (recorderRef.current && recorderRef.current.state === 'recording') {
          recorderRef.current.stop();
        }
        await connectToDeepgram();
        setIsRecording(true);
      } catch (error) {
        console.error("Error connecting to Deepgram:", error);
        setError(new Error("Failed to connect to Deepgram. Please try again."));
      }
    }
  };

  const stopRecording = async () => {
    disconnectFromDeepgram();
    setIsRecording(false);
    if (realtimeTranscript) {
      handleInputChange({ target: { value: realtimeTranscript } } as React.ChangeEvent<HTMLInputElement>);
    }
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
  };

  const handleStopRecordingAndSubmit = async () => {
    await stopRecording();
    handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
  };

  useEffect(() => {
    if (connectionState === SOCKET_STATES.closed && isRecording) {
      setIsRecording(false);
    }
  }, [connectionState, isRecording]);

  return (
    <ErrorBoundary fallback={<div className="p-4 text-red-500">Something went wrong. Please try again later.</div>}>
      <div className={`flex flex-col h-screen ${theme === 'light' ? 'bg-light-bg text-light-text' : 'bg-dark-bg text-dark-text'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-2 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
          <div className="flex-1 flex items-center">
            <button 
              onClick={toggleSidenav} 
              className={`z-30 ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}
            >
              <Menu size={20} />
            </button>
          </div>
          <h1 className={`text-lg font-semibold flex-1 text-center ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>AI Chat</h1>
          <div className="flex-1"></div>
        </div>

        {/* Scroll area (message list) */}
        <div className="flex-1 overflow-y-auto">
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

        {/* Text entry form */}
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
            recorderRef={recorderRef}
          />
        </div>
      </div>

      {/* Sidenav */}
      <div 
        ref={sidenavRef} 
        className={`fixed top-0 left-0 h-full w-56 bg-gray-800 text-white p-3 transform transition-transform duration-300 ease-in-out z-50 ${
          isSidenavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidenavOpen(false)}
        ></div>
      )}
    </ErrorBoundary>
  );
}

export default ChatInterface;