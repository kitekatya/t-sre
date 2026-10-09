import type { Task } from "../types";
import { Button } from "./Button";

import "./TaskCard.css";

const DESCRIPTION_PREVIEW_LENGTH = 140;

function getDescriptionPreview(
  description: string | null,
) {
  if (!description) {
    return "";
  }

  if (description.length <= DESCRIPTION_PREVIEW_LENGTH) {
    return description;
  }

  return `${description.slice(
    0,
    DESCRIPTION_PREVIEW_LENGTH,
  )}…`;
}

interface TaskCardProps {
  task: Task;
  index: number;
  processing: boolean;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({
  task,
  index,
  processing,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <article
      className={`task-card ${
        task.is_completed
          ? "task-card-completed"
          : ""
      }`}
    >
      <div className="task-number">
        {String(index + 1).padStart(2, "0")}
      </div>

      <button
        type="button"
        className={`status-button ${
          task.is_completed
            ? "status-button-completed"
            : ""
        }`}
        disabled={processing}
        onClick={() => onToggle(task)}
      >
        {task.is_completed ? "✓" : ""}
      </button>

      <div className="task-text">
        <div className="task-title-row">
          <h3>{task.title}</h3>

          <span
            className={`status-badge ${
              task.is_completed
                ? "status-done"
                : "status-active"
            }`}
          >
            {task.is_completed
              ? "Готово"
              : "В работе"}
          </span>
        </div>

        {task.description && (
          <p>
            {getDescriptionPreview(task.description)}
          </p>
        )}
      </div>

      <div className="task-actions">
        <Button
          variant="soft"
          disabled={processing}
          onClick={() => onEdit(task)}
        >
          Изменить
        </Button>

        <Button
          variant="danger"
          disabled={processing}
          onClick={() => onDelete(task)}
        >
          Удалить
        </Button>
      </div>
    </article>
  );
}