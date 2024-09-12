import React, { useState, useEffect } from 'react';
import { X, Sun, Moon, Monitor } from 'lucide-react';

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
      }, 2000); // Highlight for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isModelSelected]);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-20`}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
        <X size={24} />
      </button>
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="mb-4">
        <h3 className="text-lg mb-2">Model</h3>
        <select
          value={model}
          onChange={(e) => handleModelChange(e.target.value as 'openai' | 'anthropic' | 'perplexity')}
          className={`w-full bg-gray-700 text-white p-2 rounded ${isModelSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="perplexity">Perplexity</option>
        </select>
      </div>
      <div className="mb-4">
        <h3 className="text-lg mb-2">Appearance</h3>
        <div className="space-y-2">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center justify-between w-full bg-gray-700 text-white p-2 rounded ${theme === 'light' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <span className="flex items-center">
              <Sun size={20} className="mr-2" />
              Light Mode
            </span>
            {theme === 'light' && <span>✓</span>}
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-between w-full bg-gray-700 text-white p-2 rounded ${theme === 'dark' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <span className="flex items-center">
              <Moon size={20} className="mr-2" />
              Dark Mode
            </span>
            {theme === 'dark' && <span>✓</span>}
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`flex items-center justify-between w-full bg-gray-700 text-white p-2 rounded ${theme === 'system' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <span className="flex items-center">
              <Monitor size={20} className="mr-2" />
              System
            </span>
            {theme === 'system' && <span>✓</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidenav;