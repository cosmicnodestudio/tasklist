export type TaskStatus = 'Todo' | 'InProgress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date | string;
  categoryId?: number;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | string;
  categoryId?: number;
}
