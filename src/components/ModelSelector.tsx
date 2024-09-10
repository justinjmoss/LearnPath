interface ModelSelectorProps {
  model: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

export default function ModelSelector({ model, onModelChange }: ModelSelectorProps) {
  return (
    <div className="p-4 border-b bg-gray-100">
      <select
        value={model}
        onChange={(e) => onModelChange(e.target.value as 'openai' | 'anthropic')}
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
      >
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
      </select>
    </div>
  );
}