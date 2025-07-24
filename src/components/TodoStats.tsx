import React from 'react';
import { CheckCircle2, Circle, Target } from 'lucide-react';

interface TodoStatsProps {
  total: number;
  completed: number;
  active: number;
}

export const TodoStats: React.FC<TodoStatsProps> = ({ total, completed, active }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 
                     hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Target className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 
                     hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <CheckCircle2 className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{completed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 
                     hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Circle className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Active</p>
            <p className="text-2xl font-bold text-gray-900">{active}</p>
          </div>
        </div>
      </div>
    </div>
  );
};