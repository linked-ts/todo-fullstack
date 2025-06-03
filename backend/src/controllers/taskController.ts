import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../types/Task';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = this.taskService.getAllTasks();
      const response: ApiResponse<typeof tasks> = {
        success: true,
        data: tasks,
        message: `Retrieved ${tasks.length} tasks`
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting tasks:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to retrieve tasks'
      };

      res.status(500).json(response);
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Task ID is required'
        };
        res.status(400).json(response);
        return;
      }

      const id = parseInt(idParam);

      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid task ID'
        };
        res.status(400).json(response);
        return;
      }

      const task = this.taskService.getTaskById(id);

      if (!task) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Task not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof task> = {
        success: true,
        data: task
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting task by ID:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to retrieve task'
      };

      res.status(500).json(response);
    }
  };

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskData: CreateTaskRequest = req.body;

      if (!taskData.text) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Task text is required'
        };
        res.status(400).json(response);
        return;
      }

      const newTask = this.taskService.createTask(taskData);
      const response: ApiResponse<typeof newTask> = {
        success: true,
        data: newTask,
        message: 'Task created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating task:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create task'
      };

      res.status(400).json(response);
    }
  };
  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Task ID is required'
        };
        res.status(400).json(response);
        return;
      }

      const id = parseInt(idParam);

      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid task ID'
        };
        res.status(400).json(response);
        return;
      }

      const updateData: UpdateTaskRequest = req.body;
      const updatedTask = this.taskService.updateTask(id, updateData);
      
      if (!updatedTask) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Task not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof updatedTask> = {
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error updating task:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update task'
      };
      
      res.status(400).json(response);
    }
  };

  /**
   * DELETE /tasks/:id - Delete a task by ID
   */
  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Task ID is required'
        };
        res.status(400).json(response);
        return;
      }

      const id = parseInt(idParam);

      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid task ID'
        };
        res.status(400).json(response);
        return;
      }

      const deleted = this.taskService.deleteTask(id);
      
      if (!deleted) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Task not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Task deleted successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error deleting task:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to delete task'
      };
      
      res.status(500).json(response);
    }
  };

  /**
   * GET /tasks/stats - Get task statistics
   */
  getTaskStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = this.taskService.getTasksCount();
      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting task stats:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to retrieve task statistics'
      };
      
      res.status(500).json(response);
    }
  };
}
