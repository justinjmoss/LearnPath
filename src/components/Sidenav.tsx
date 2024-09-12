import React, { useState, useEffect } from 'react';
import { X, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';

interface SidenavProps {
  isOpen: boolean;
  onClose: () => void;
  model: 'openai' | 'anthropic' | 'perplexity';
  onModelChange: (model: 'openai' | 'anthropic' | 'perplexity') => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const Sidenav: React.FC<SidenavProps> = ({ isOpen, onClose, model, onModelChange, theme, setTheme }) => {
  const [isModelSelected, setIsModelSelected] = useState(false);

  const handleModelChange = (newModel: 'openai' | 'anthropic' | 'perplexity') => {
    onModelChange(newModel);
    setIsModelSelected(true);
  };

  useEffect(() => {
    if (isModelSelected) {
      const timer = setTimeout(() => {
        setIsModelSelected(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isModelSelected]);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-56 bg-gray-800 text-white p-3 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-20`}
    >
      <button onClick={onClose} className="absolute top-2 right-2 text-white">
        <X size={20} />
      </button>
      <h2 className="text-lg font-bold mb-3">Settings</h2>
      <div className="mb-3">
        <h3 className="text-sm font-medium mb-1">Model</h3>
        <div className="relative">
          <select
            value={model}
            onChange={(e) => handleModelChange(e.target.value as 'openai' | 'anthropic' | 'perplexity')}
            className={`w-full bg-gray-700 text-white p-1.5 pr-8 text-sm rounded appearance-none ${isModelSelected ? 'ring-1 ring-blue-500' : ''}`}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="perplexity">Perplexity</option>
          </select>
          <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-1">Appearance</h3>
        <div className="space-y-1">
          {['system', 'light', 'dark'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t as 'system' | 'light' | 'dark')}
              className={`flex items-center justify-between w-full p-2 rounded text-sm transition-colors
                ${theme === t ? 'ring-2 ring-blue-500 bg-gray-700' : 'hover:bg-gray-700'}
              `}
            >
              <span className="flex items-center">
                {t === 'system' && <Monitor size={16} className="mr-2" />}
                {t === 'light' && <Sun size={16} className="mr-2" />}
                {t === 'dark' && <Moon size={16} className="mr-2" />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
              {theme === t && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidenav;