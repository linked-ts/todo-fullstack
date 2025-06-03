'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskStats } from '../types/Task';
import { TaskApiService } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilters, { TaskFilter } from './TaskFilters';
import ThemeToggle from './ThemeToggle';

export const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');

  const { theme } = useTheme();

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(query)
      );
    }

    switch (activeFilter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'all':
      default:
        break;
    }

    return filtered;
  }, [tasks, searchQuery, activeFilter]);

  const filteredStats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.completed).length;
    const pending = total - completed;

    return { total, completed, pending };
  }, [filteredTasks]);

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const fetchedTasks = await TaskApiService.getAllTasks();
      setTasks(fetchedTasks);
      
      const total = fetchedTasks.length;
      const completed = fetchedTasks.filter(task => task.completed).length;
      const pending = total - completed;
      setStats({ total, completed, pending });
      
      setIsOnline(true);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks. Please check your connection.');
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateTask = async (text: string): Promise<void> => {
    try {
      setError(null);
      const newTask = await TaskApiService.createTask({ text });
      setTasks(prevTasks => [newTask, ...prevTasks]);
      
      setStats(prevStats => ({
        total: prevStats.total + 1,
        completed: prevStats.completed,
        pending: prevStats.pending + 1
      }));
      
      setIsOnline(true);
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
      setIsOnline(false);
      throw error;
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean): Promise<void> => {
    try {
      setError(null);
      const updatedTask = await TaskApiService.updateTask(id, { completed });
      
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? updatedTask : task
        )
      );
      
      setStats(prevStats => ({
        total: prevStats.total,
        completed: completed ? prevStats.completed + 1 : prevStats.completed - 1,
        pending: completed ? prevStats.pending - 1 : prevStats.pending + 1
      }));
      
      setIsOnline(true);
    } catch (error) {
      console.error('Error toggling task:', error);
      setError('Failed to update task. Please try again.');
      setIsOnline(false);
      throw error;
    }
  };

  const handleDeleteTask = async (id: number): Promise<void> => {
    try {
      setError(null);
      await TaskApiService.deleteTask(id);
      
      const taskToDelete = tasks.find(task => task.id === id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      
      if (taskToDelete) {
        setStats(prevStats => ({
          total: prevStats.total - 1,
          completed: taskToDelete.completed ? prevStats.completed - 1 : prevStats.completed,
          pending: taskToDelete.completed ? prevStats.pending : prevStats.pending - 1
        }));
      }
      
      setIsOnline(true);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
      setIsOnline(false);
      throw error;
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const checkConnection = async () => {
      const isHealthy = await TaskApiService.healthCheck();
      setIsOnline(isHealthy);
    };

    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                TodoApp
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Simple, clean task management
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${
              isOnline
                ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                : theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}>
              {isOnline ? 'Connected' : 'Offline'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-lg border text-center transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-600'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {stats.total}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Total
            </div>
          </div>
          <div className={`p-4 rounded-lg border text-center transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-600'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              {stats.completed}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Completed
            </div>
          </div>
          <div className={`p-4 rounded-lg border text-center transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-600'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {stats.pending}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Pending
            </div>
          </div>
        </div>

        {error && (
          <div className={`mb-6 p-4 border rounded-lg ${
            theme === 'dark'
              ? 'bg-red-900/20 border-red-800 text-red-300'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className={`w-5 h-5 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-500'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className={`font-medium text-sm transition-colors ${
                  theme === 'dark'
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-red-600 hover:text-red-800'
                }`}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            taskCounts={filteredStats}
          />
        </div>

        <div className="mb-8">
          <TaskForm
            onSubmit={handleCreateTask}
            isLoading={isLoading}
            placeholder="What needs to be done?"
          />
        </div>

        <div className={`rounded-lg border p-6 transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-200'
        }`}>
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            isLoading={isLoading}
          />
        </div>

        <footer className={`mt-12 text-center text-sm ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
          <p className="mt-1">Backend powered by Express.js</p>
          <p className="mt-2 flex items-center justify-center gap-2">
            <span>Dark mode & search features enabled</span>
            <span className={`w-2 h-2 rounded-full ${
              theme === 'dark' ? 'bg-blue-400' : 'bg-gray-400'
            }`}></span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TodoApp;
