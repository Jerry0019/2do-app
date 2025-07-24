import React, { useState } from 'react';
import { Check, X, Edit3 } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onUpdate(todo.id, editText.trim());
    }
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`group bg-white rounded-xl shadow-sm border border-gray-100 
                    transition-all duration-300 hover:shadow-md hover:border-gray-200
                    ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-center p-4 gap-4">
        {/* Toggle Button */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                     transition-all duration-200 hover:scale-110 active:scale-95
                     ${todo.completed 
                       ? 'bg-green-500 border-green-500 text-white shadow-md' 
                       : 'border-gray-300 hover:border-green-400 bg-white'}`}
        >
          {todo.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Task Text */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="w-full px-2 py-1 border border-blue-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-200
                       text-gray-800 font-medium"
              autoFocus
            />
          ) : (
            <p
              onDoubleClick={!todo.completed ? handleEdit : undefined}
              className={`text-gray-800 font-medium cursor-pointer transition-all duration-200
                         ${todo.completed 
                           ? 'line-through text-gray-500' 
                           : 'hover:text-blue-600'}`}
            >
              {todo.text}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 
                       transition-opacity duration-200">
          {!isEditing && !todo.completed && (
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-500 p-2 rounded-lg
                       hover:bg-blue-50 transition-all duration-200 active:scale-95"
            >
              <Edit3 size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-500 p-2 rounded-lg
                     hover:bg-red-50 transition-all duration-200 active:scale-95"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};