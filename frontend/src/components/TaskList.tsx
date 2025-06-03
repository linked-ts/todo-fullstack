'use client';

import React, { useState } from 'react';
import { Task } from '../types/Task';
import { useTheme } from '../contexts/ThemeContext';


interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
  isLoading?: boolean;
}


interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDeleteTask }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { theme } = useTheme();

  const handleToggleComplete = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(task.id, !task.completed);
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDeleteTask(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`
      group p-4 border rounded-lg transition-all duration-200 hover:shadow-md
      ${theme === 'dark'
        ? `border-gray-600 ${task.completed ? 'bg-gray-800' : 'bg-gray-700'}`
        : `border-gray-200 ${task.completed ? 'bg-gray-50' : 'bg-white'}`
      }
      ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
    `}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          disabled={isToggling || isDeleting}
          className={`
            mt-1 w-5 h-5 rounded border-2 flex items-center justify-center
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
            ${task.completed
              ? theme === 'dark'
                ? 'bg-blue-600 border-blue-600 text-white focus:ring-blue-500'
                : 'bg-gray-800 border-gray-800 text-white focus:ring-gray-500'
              : theme === 'dark'
                ? 'border-gray-500 hover:border-gray-400 focus:ring-blue-500'
                : 'border-gray-300 hover:border-gray-400 focus:ring-gray-500'
            }
            ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isToggling ? (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
          ) : task.completed ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : null}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`
            text-sm leading-relaxed break-words
            ${task.completed
              ? theme === 'dark' ? 'text-gray-400 line-through' : 'text-gray-500 line-through'
              : theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }
          `}>
            {task.text}
          </p>
          
          <div className={`mt-2 flex items-center gap-4 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <span>Created: {formatDate(task.createdAt)}</span>
            {task.updatedAt !== task.createdAt && (
              <span>Updated: {formatDate(task.updatedAt)}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting || isToggling}
          className={`
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            ${theme === 'dark'
              ? 'text-gray-500 hover:text-red-400'
              : 'text-gray-400 hover:text-red-500'
            }
            ${isDeleting || isToggling ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          aria-label="Delete task"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};


export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Add your first task to get started!</p>
      </div>
    );
  }


  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
