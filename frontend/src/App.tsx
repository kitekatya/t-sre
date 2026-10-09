import {
  useEffect,
  useState,
} from "react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./api";

import type { Task } from "./types";

import { Button } from "./components/Button";
import { ConfirmModal } from "./components/ConfirmModal";
import { TaskCard } from "./components/TaskCard";
import { TaskFormModal } from "./components/TaskFormModal";

import "./App.css";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Произошла неизвестная ошибка";
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [processingTaskId, setProcessingTaskId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const completedCount = tasks.filter(
    (task) => task.is_completed,
  ).length;

  async function loadTasks() {
    try {
      setError("");

      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  function openCreateModal() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function closeFormModal() {
    setFormOpen(false);
    setEditingTask(null);
  }

  async function saveTask(value: {
    title: string;
    description: string | null;
  }) {
    try {
      setSaving(true);
      setError("");

      if (editingTask) {
        await updateTask(editingTask.id, {
          title: value.title,
          description: value.description,
          is_completed: editingTask.is_completed,
        });
      } else {
        await createTask({
          title: value.title,
          description: value.description,
          is_completed: false,
        });
      }

      closeFormModal();
      await loadTasks();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task: Task) {
    try {
      setProcessingTaskId(task.id);
      setError("");

      await updateTask(task.id, {
        title: task.title,
        description: task.description,
        is_completed: !task.is_completed,
      });

      await loadTasks();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setProcessingTaskId(null);
    }
  }

  async function confirmDelete() {
    if (!taskToDelete) {
      return;
    }

    try {
      setProcessingTaskId(taskToDelete.id);
      setError("");

      await deleteTask(taskToDelete.id);

      setTaskToDelete(null);
      await loadTasks();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setProcessingTaskId(null);
    }
  }

  return (
    <div className="app-shell">
      <div className="app">
        <header className="header">
          <div>
            <div className="brand-row">
              <div className="brand-icon">✓</div>
              <p className="eyebrow">Task Tracker</p>
            </div>

            <h1>
              Трекер
              <span> задач.</span>
            </h1>

            <p className="subtitle">
              Создавайте, изменяйте и отмечайте выполненные задачи.
            </p>
          </div>

          <div className="header-actions">
            {!loading && (
              <div className="stats">
                <div className="stat-card">
                  <span>Всего</span>
                  <strong>{tasks.length}</strong>
                </div>

                <div className="stat-card stat-card-accent">
                  <span>Готово</span>
                  <strong>{completedCount}</strong>
                </div>
              </div>
            )}

            <Button
              variant="primary"
              className="create-button"
              onClick={openCreateModal}
            >
              + Новая задача
            </Button>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <div>
              <strong>Что-то пошло не так</strong>
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        <main className="content">
          <section className="tasks-section">
            <div className="section-title">
              <div>
                <h2>Список задач</h2>
              </div>

              {!loading && tasks.length > 0 && (
                <span className="task-count">
                  {tasks.length}
                </span>
              )}
            </div>

            {loading ? (
              <div className="empty-state">
                Загружаем задачи...
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✦</div>

                <h3>Пока ничего нет</h3>

                <p>
                  Создай первую задачу.
                </p>

                <Button
                  variant="primary"
                  className="empty-create-button"
                  onClick={openCreateModal}
                >
                  + Создать задачу
                </Button>
              </div>
            ) : (
              <div className="task-list">
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    processing={
                      processingTaskId === task.id
                    }
                    onToggle={(task) =>
                      void toggleTask(task)
                    }
                    onEdit={openEditModal}
                    onDelete={setTaskToDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {formOpen && (
        <TaskFormModal
          task={editingTask}
          saving={saving}
          onSubmit={saveTask}
          onClose={closeFormModal}
        />
      )}

      {taskToDelete && (
        <ConfirmModal
          title="Удалить задачу?"
          description={`«${taskToDelete.title}» будет удалена без возможности восстановления.`}
          onConfirm={() =>
            void confirmDelete()
          }
          onClose={() =>
            setTaskToDelete(null)
          }
        />
      )}
    </div>
  );
}

export default App;