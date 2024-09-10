"use client";

import { useState } from 'react';
import { useChat } from 'ai/react';
import MessageList from './MessageList';
import InputField from './InputField';
import ModelSelector from './ModelSelector';
import ErrorDisplay from './ErrorDisplay';
import LoadingIndicator from './LoadingIndicator';

export default function ChatInterface() {
  const [model, setModel] = useState<'openai' | 'anthropic'>('openai');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: { model },
  });

  const handleModelChange = (newModel: 'openai' | 'anthropic') => {
    setModel(newModel);
  };

  return (
    <div className="flex flex-col h-full">
      <ModelSelector model={model} onModelChange={handleModelChange} />
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        <MessageList messages={messages} />
        {isLoading && <LoadingIndicator />}
        {error && <ErrorDisplay error={error} />}
      </div>
      <InputField
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}