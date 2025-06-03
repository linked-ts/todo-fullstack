'use client';

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';


export type TaskFilter = 'all' | 'pending' | 'completed';


interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  taskCounts: {
    total: number;
    pending: number;
    completed: number;
  };
}


export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  taskCounts
}) => {
  const { theme } = useTheme();

  const filters: { key: TaskFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: taskCounts.total },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed }
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className={`
            w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500'
            }
          `}
          maxLength={100}
          autoComplete="off"
        />
        
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className={`
              absolute inset-y-0 right-0 pr-3 flex items-center
              ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
              transition-colors duration-200
            `}
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>


      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${activeFilter === filter.key
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white focus:ring-blue-500'
                  : 'bg-gray-800 text-white focus:ring-gray-500'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
              }
            `}
          >
            <span>{filter.label}</span>
            {filter.count > 0 && (
              <span
                className={`
                  ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${activeFilter === filter.key
                    ? theme === 'dark'
                      ? 'bg-blue-500 text-blue-100'
                      : 'bg-gray-600 text-gray-100'
                    : theme === 'dark'
                      ? 'bg-gray-600 text-gray-200'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>


      {searchQuery && (
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {taskCounts.total === 0 ? (
            <span>No tasks found for "{searchQuery}"</span>
          ) : (
            <span>
              Found {taskCounts.total} task{taskCounts.total !== 1 ? 's' : ''} for "{searchQuery}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
