/**
 * Task interface representing a todo item
 * This matches the backend Task interface
 */
export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Interface for creating a new task
 */
export interface CreateTaskRequest {
  text: string;
}

/**
 * Interface for updating an existing task
 */
export interface UpdateTaskRequest {
  text?: string;
  completed?: boolean;
}

/**
 * API Response wrapper interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Task statistics interface
 */
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}
