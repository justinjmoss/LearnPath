import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-gray-700 text-gray-200'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            <ReactMarkdown className="text-sm">{message.content}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}