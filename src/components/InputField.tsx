import { FormEvent } from 'react';
import { Send } from 'lucide-react';

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
          className="flex-1 p-2 bg-transparent border border-gray-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-gray-400 text-white placeholder-gray-500 resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
          rows={1}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 bg-transparent border border-l-0 border-gray-700 rounded-r-lg hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 transition duration-300 ease-in-out flex items-center justify-center"
        >
          <Send size={20} className="text-gray-400" />
        </button>
      </div>
    </form>
  );
}