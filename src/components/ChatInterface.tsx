"use client";

import React, { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import MessageList from './MessageList';
import InputField from './InputField';
import ModelSelector from './ModelSelector';
import ErrorDisplay from './ErrorDisplay';

function ChatInterface() {
  const [model, setModel] = useState<'openai' | 'anthropic'>('openai');
  const [error, setError] = useState<Error | null>(null);

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

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        {error && <ErrorDisplay error={error} />}
      </div>
      <div className="border-t border-gray-700">
        <InputField
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
        <div className="flex justify-end">
          <ModelSelector model={model} onModelChange={handleModelChange} />
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;