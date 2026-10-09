import type {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/api/tasks`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить задачи");
  }

  return response.json();
}

export async function createTask(
  task: CreateTaskRequest,
): Promise<Task> {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Не удалось создать задачу");
  }

  return response.json();
}

export async function updateTask(
  id: number,
  task: UpdateTaskRequest,
): Promise<Task> {
  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Не удалось обновить задачу");
  }

  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Не удалось удалить задачу");
  }
}