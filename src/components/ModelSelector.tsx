interface ModelSelectorProps {
  model: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

export default function ModelSelector({ model, onModelChange }: ModelSelectorProps) {
  return (
    <div className="p-2 bg-transparent">
      <select
        value={model}
        onChange={(e) => onModelChange(e.target.value as 'openai' | 'anthropic')}
        className="p-1 text-xs border-none rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400 bg-transparent"
      >
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
      </select>
    </div>
  );
}