'use client';

import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';


interface TaskFormProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}


export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = "Add a new task..."
}) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(trimmedText);
      setText(''); 
    } catch (error) {
      console.error('Error submitting task:', error);

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const isDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isDisabled}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${theme === 'dark'
                ? `border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400
                   focus:ring-blue-500 focus:border-blue-500
                   ${isDisabled
                     ? 'opacity-60 cursor-not-allowed'
                     : 'hover:border-gray-500'
                   }`
                : `border-gray-300 bg-white text-gray-900 placeholder-gray-400
                   focus:ring-gray-500 focus:border-transparent
                   ${isDisabled
                     ? 'bg-gray-100 cursor-not-allowed opacity-60'
                     : 'hover:border-gray-400'
                   }`
              }
            `}
            maxLength={500}
            autoComplete="off"
            aria-label="New task input"
          />
        </div>


        <button
          type="submit"
          disabled={isDisabled || !text.trim()}
          className={`
            px-6 py-3 font-medium rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${isDisabled || !text.trim()
              ? theme === 'dark'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500'
                : 'bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900 focus:ring-gray-500'
            }
          `}
          aria-label="Add task"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </div>
          ) : (
            'Add Task'
          )}
        </button>
      </div>


      {text.length > 0 && (
        <div className="mt-2 text-right">
          <span className={`text-sm ${
            text.length > 450 
              ? 'text-red-500' 
              : text.length > 400 
                ? 'text-yellow-600' 
                : 'text-gray-400'
          }`}>
            {text.length}/500
          </span>
        </div>
      )}
    </form>
  );
};

export default TaskForm;
