"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';
import { ArrowUp, Mic, X, Check } from 'lucide-react';
import { useTheme } from '../lib/contexts/ThemeContext';
import { useDeepgram } from '../lib/contexts/DeepgramContext';

interface InputFieldProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onMicrophoneClick: () => void;
  isRecording: boolean;
}

export default function InputField({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  onMicrophoneClick,
  isRecording,
}: InputFieldProps) {
  const { theme } = useTheme();
  const { realtimeTranscript, disconnectFromDeepgram } = useDeepgram();
  const [duration, setDuration] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isRecording) {
      const startTime = Date.now() - duration * 1000;
      const updateDuration = () => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
        animationRef.current = requestAnimationFrame(updateDuration);
      };
      animationRef.current = requestAnimationFrame(updateDuration);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, duration]);

  useEffect(() => {
    if (isRecording && waveformRef.current) {
      const waveform = waveformRef.current;
      const bars = Array.from(waveform.children) as HTMLElement[];

      const animateBars = () => {
        bars.forEach((bar) => {
          const height = Math.random() * 100;
          bar.style.height = `${height}%`;
        });
        requestAnimationFrame(animateBars);
      };

      animateBars();
    }
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmRecording = () => {
    disconnectFromDeepgram();
    onMicrophoneClick(); // This will set isRecording to false
    if (realtimeTranscript) {
      const transcriptEvent = {
        target: { value: realtimeTranscript }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(transcriptEvent);
      
      // Automatically submit the form with the transcribed text
      const submitEvent = new Event('submit') as unknown as FormEvent<HTMLFormElement>;
      handleSubmit(submitEvent);
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${theme === 'light' ? 'bg-gradient-to-b from-gray-100 to-white' : 'bg-gradient-to-b from-gray-900 to-black'}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {!isRecording ? (
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className={`w-full py-3 px-4 pr-24 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'light'
                  ? 'bg-white text-gray-800 placeholder-gray-500'
                  : 'bg-gray-800 text-white placeholder-gray-500'
              }`}
            />
          ) : (
            <div className={`w-full py-3 px-4 pr-24 rounded-full flex items-center ${
              theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
            }`}>
              <div className="flex-grow mr-4">
                <div
                  ref={waveformRef}
                  className="flex items-center justify-start space-x-1 h-6 overflow-hidden"
                >
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-400 rounded-full transition-all duration-100"
                      style={{ height: '20%' }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-blue-400 font-mono">{formatTime(duration)}</span>
            </div>
          )}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {isRecording ? (
              <>
                <button
                  type="button"
                  onClick={onMicrophoneClick}
                  className="p-2 text-red-500 hover:text-red-400 transition-colors"
                  aria-label="Stop recording"
                >
                  <X size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRecording}
                  className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                  aria-label="Confirm recording"
                >
                  <Check size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onMicrophoneClick}
                  className={`p-2 transition-colors ${
                    theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label="Start recording"
                >
                  <Mic size={20} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`p-2 transition-colors ${
                    theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label="Send message"
                >
                  <ArrowUp size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}