export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  priority: 'low' | 'medium' | 'high';
}
export interface CreateTaskDTO {
  title: string;
  priority?: 'low' | 'medium' | 'high';
}
export interface UpdateTaskDTO {
  title?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}