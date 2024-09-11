import React from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/contexts/ThemeContext';

interface SidenavProps {
  isOpen: boolean;
  onClose: () => void;
  model: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

const Sidenav: React.FC<SidenavProps> = ({ isOpen, onClose, model, onModelChange }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-20`}
    >
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-white">
          <X size={24} />
        </button>
      </div>
      <nav className="mt-8">
        <ul className="space-y-2">
          <li>
            <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700">
              Chat History
            </a>
          </li>
          <li>
            <div className="px-4 py-2">
              <label htmlFor="model-select" className="block text-sm font-medium text-white">
                Model
              </label>
              <select
                id="model-select"
                value={model}
                onChange={(e) => onModelChange(e.target.value as 'openai' | 'anthropic')}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                  theme === 'dark' ? 'text-gray-900 bg-white' : 'text-white bg-gray-700'
                }`}
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>
          </li>
          <li>
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidenav;