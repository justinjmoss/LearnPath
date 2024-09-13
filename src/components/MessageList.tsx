import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../lib/contexts/ThemeContext';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  isRecording: boolean;
}

export default function MessageList({ messages, isRecording }: MessageListProps) {
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="py-4 px-6 space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          } ${index === 0 ? 'mt-2' : ''} ${index === messages.length - 1 ? 'mb-2' : ''}`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : theme === 'light'
                ? 'bg-light-secondary text-gray-800'
                : 'bg-dark-secondary text-gray-200'
            }`}
          >
            <ReactMarkdown 
              className={`text-sm prose ${
                message.role === 'user' 
                  ? 'prose-invert text-white' 
                  : theme === 'light' 
                    ? 'prose-gray' 
                    : 'prose-invert'
              }`}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
      {isRecording && (
        <div className="flex justify-start mb-2">
          <div className={`max-w-[80%] p-3 rounded-lg animate-pulse ${
            theme === 'light' ? 'bg-light-secondary' : 'bg-dark-secondary'
          }`}>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
              Recording...
            </p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}