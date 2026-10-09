export interface Task {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  is_completed?: boolean;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string | null;
  is_completed: boolean;
}