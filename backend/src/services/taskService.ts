import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/Task';

export class TaskService {
  private readonly dataFilePath: string;
  private tasks: Task[] = [];

  constructor() {
    this.dataFilePath = join(__dirname, '../../tasks.json');
    this.loadTasks();
  }

  private loadTasks(): void {
    try {
      if (existsSync(this.dataFilePath)) {
        const data = readFileSync(this.dataFilePath, 'utf-8');
        this.tasks = JSON.parse(data).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
      } else {
        this.tasks = [];
        this.saveTasks();
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.tasks = [];
    }
  }

  private saveTasks(): void {
    try {
      writeFileSync(this.dataFilePath, JSON.stringify(this.tasks, null, 2));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw new Error('Failed to save tasks');
    }
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  createTask(taskData: CreateTaskRequest): Task {
    if (!taskData.text || taskData.text.trim().length === 0) {
      throw new Error('Task text is required and cannot be empty');
    }

    const now = new Date();
    const newTask: Task = {
      id: Date.now(),
      text: taskData.text.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now
    };

    this.tasks.push(newTask);
    this.saveTasks();

    return newTask;
  }

  updateTask(id: number, updateData: UpdateTaskRequest): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      return null;
    }

    const existingTask = this.tasks[taskIndex];
    if (!existingTask) {
      return null;
    }

    const updatedTask: Task = {
      ...existingTask,
      text: updateData.text !== undefined ? updateData.text.trim() : existingTask.text,
      completed: updateData.completed !== undefined ? updateData.completed : existingTask.completed,
      updatedAt: new Date()
    };

    if (updateData.text !== undefined && updatedTask.text.length === 0) {
      throw new Error('Task text cannot be empty');
    }

    this.tasks[taskIndex] = updatedTask;
    this.saveTasks();

    return updatedTask;
  }

  deleteTask(id: number): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);

    if (this.tasks.length < initialLength) {
      this.saveTasks();
      return true;
    }

    return false;
  }

  getTasksCount(): { total: number; completed: number; pending: number } {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    const pending = total - completed;

    return { total, completed, pending };
  }
}
