"use client";

import { FormEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../lib/contexts/ThemeContext';

interface InputFieldProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function InputField({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: InputFieldProps) {
  const { theme } = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-transparent">
      <div className="flex items-stretch">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={`flex-1 p-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary resize-none min-h-[40px] max-h-[120px] overflow-y-auto
            ${theme === 'light' 
              ? 'bg-light-input-bg text-light-input-text border border-light-input-border placeholder-gray-500' 
              : 'bg-dark-input-bg text-dark-input-text border border-dark-input-border placeholder-gray-400'
            }`}
          rows={1}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-3 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary transition duration-300 ease-in-out flex items-center justify-center
            ${theme === 'light'
              ? 'bg-light-input-bg border border-l-0 border-light-input-border hover:bg-gray-200'
              : 'bg-dark-input-bg border border-l-0 border-dark-input-border hover:bg-gray-700'
            }`}
        >
          <ArrowUp size={20} className={theme === 'light' ? 'text-light-text' : 'text-dark-text'} />
        </button>
      </div>
    </form>
  );
}