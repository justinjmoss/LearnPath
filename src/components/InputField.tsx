"use client";

import { FormEvent, useState, useEffect } from 'react';
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
  recorderRef: React.RefObject<MediaRecorder | null>;
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
  recorderRef,
}: InputFieldProps) {
  const { theme } = useTheme();
  const { realtimeTranscript, disconnectFromDeepgram } = useDeepgram();
  const [localInput, setLocalInput] = useState(input);

  useEffect(() => {
    setLocalInput(input);
  }, [input]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRecording) {
      onStopRecordingAndSubmit();
    } else {
      handleSubmit(e);
    }
    setLocalInput('');
  };

  const handleStopRecording = () => {
    disconnectFromDeepgram();
    setLocalInput('');
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
    onMicrophoneClick(); // This should set isRecording to false
  };

  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInput(e.target.value);
    handleInputChange(e);
  };

  return (
    <div className={`p-4 ${theme === 'light' ? 'bg-light-bg' : 'bg-dark-bg'} ${isSidenavOpen ? 'opacity-50 pointer-events-none' : ''}`}>
      <form onSubmit={handleFormSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={isRecording ? realtimeTranscript : localInput}
            onChange={handleLocalInputChange}
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
              onClick={handleStopRecording}
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
              disabled={isLoading || (!isRecording && !localInput.trim())}
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