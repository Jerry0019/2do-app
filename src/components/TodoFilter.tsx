import React from 'react';
import { TodoFilter as FilterType } from '../types/todo';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const TodoFilter: React.FC<TodoFilterProps> = ({ 
  currentFilter, 
  onFilterChange, 
  counts 
}) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex gap-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200
                         flex items-center gap-2 hover:scale-105 active:scale-95
                         ${currentFilter === filter.key
                           ? 'bg-blue-500 text-white shadow-md'
                           : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                         }`}
            >
              {filter.label}
              <span className={`text-xs px-2 py-1 rounded-full font-bold
                              ${currentFilter === filter.key
                                ? 'bg-blue-400 text-white'
                                : 'bg-gray-200 text-gray-600'
                              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};