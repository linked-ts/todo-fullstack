import axios, { AxiosResponse } from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse, TaskStats } from '../types/Task';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class TaskApiService {
  static async getAllTasks(): Promise<Task[]> {
    try {
      const response: AxiosResponse<ApiResponse<Task[]>> = await api.get('/api/tasks');
      
      if (response.data.success && response.data.data) {
        return response.data.data.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
      }
      
      throw new Error(response.data.error || 'Failed to fetch tasks');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  static async getTaskById(id: number): Promise<Task> {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await api.get(`/api/tasks/${id}`);
      
      if (response.data.success && response.data.data) {
        const task = response.data.data;
        return {
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        };
      }
      
      throw new Error(response.data.error || 'Failed to fetch task');
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await api.post('/api/tasks', taskData);
      
      if (response.data.success && response.data.data) {
        const task = response.data.data;
        return {
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        };
      }
      
      throw new Error(response.data.error || 'Failed to create task');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async updateTask(id: number, updateData: UpdateTaskRequest): Promise<Task> {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await api.put(`/api/tasks/${id}`, updateData);
      
      if (response.data.success && response.data.data) {
        const task = response.data.data;
        return {
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        };
      }
      
      throw new Error(response.data.error || 'Failed to update task');
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  }

  static async deleteTask(id: number): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/api/tasks/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  static async getTaskStats(): Promise<TaskStats> {
    try {
      const response: AxiosResponse<ApiResponse<TaskStats>> = await api.get('/api/tasks/stats');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.error || 'Failed to fetch task statistics');
    } catch (error) {
      console.error('Error fetching task stats:', error);
      throw error;
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default TaskApiService;
