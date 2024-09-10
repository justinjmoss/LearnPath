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
            className={`max-w-3/4 p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-black border'
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}