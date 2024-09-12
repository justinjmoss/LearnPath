"use client";

import { FormEvent } from 'react';
import { ArrowUp, Mic, X } from 'lucide-react';
import { useTheme } from '../lib/contexts/ThemeContext';
import { useDeepgram } from '../lib/contexts/DeepgramContext';

interface InputFieldProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onMicrophoneClick: () => void;
  isRecording: boolean;
  onStopRecordingAndSubmit: () => void;
  isSidenavOpen: boolean;
}

export default function InputField({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  onMicrophoneClick,
  isRecording,
  onStopRecordingAndSubmit,
  isSidenavOpen,
}: InputFieldProps) {
  const { theme } = useTheme();
  const { realtimeTranscript } = useDeepgram();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRecording) {
      onStopRecordingAndSubmit();
    } else {
      handleSubmit(e);
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-10 p-4 ${theme === 'light' ? 'bg-light-bg' : 'bg-dark-bg'} ${isSidenavOpen ? 'opacity-50 pointer-events-none' : ''}`}>
      <form onSubmit={handleFormSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={isRecording ? realtimeTranscript : input}
            onChange={handleInputChange}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            className={`w-full py-3 px-4 pr-24 rounded-lg focus:outline-none ${
              isRecording ? 'animate-pulse-glow' : 'focus:ring-2 focus:ring-blue-500'
            } ${
              theme === 'light'
                ? 'bg-gray-100 text-gray-800 placeholder-gray-500'
                : 'bg-gray-800 text-white placeholder-gray-500'
            }`}
            readOnly={isRecording}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onMicrophoneClick}
              className={`p-2 transition-colors ${
                isRecording
                  ? 'text-red-500 hover:text-red-600'
                  : theme === 'light'
                  ? 'text-gray-600 hover:text-gray-800'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? <X size={20} /> : <Mic size={20} />}
            </button>
            <button
              type="submit"
              disabled={isLoading || (!isRecording && !input.trim())}
              className={`p-2 transition-colors ${
                theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'
              }`}
              aria-label={isRecording ? "Stop recording and send" : "Send message"}
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}