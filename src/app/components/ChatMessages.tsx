interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto p-2">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] p-2 rounded-lg ${
              message.role === 'user'
                ? 'bg-gray-700 text-gray-200'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}