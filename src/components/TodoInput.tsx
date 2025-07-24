import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-6 py-4 pr-14 text-lg border-2 border-gray-200 rounded-2xl 
                   focus:border-blue-500 focus:ring-0 focus:outline-none transition-colors
                   placeholder-gray-400 bg-white shadow-sm"
          autoFocus
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 
                   bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 
                   text-white p-3 rounded-xl transition-all duration-200
                   disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                   active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>
    </form>
  );
}