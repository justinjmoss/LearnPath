function ChatMessages({ messages }) {
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
            className={`max-w-[70%] p-1.5 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <p className="text-xs">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}