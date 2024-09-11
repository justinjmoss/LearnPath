import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../lib/contexts/ThemeContext';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-3 pt-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[90%] p-2 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : theme === 'light'
                ? 'bg-light-secondary text-gray-800'
                : 'bg-dark-secondary text-gray-200'
            }`}
          >
            <ReactMarkdown className={`text-sm prose ${message.role === 'user' ? 'prose-invert' : theme === 'light' ? 'prose-gray' : 'prose-invert'}`}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}