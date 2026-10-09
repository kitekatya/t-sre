import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import type { Task } from "../types";
import { Button } from "./Button";
import { Modal } from "./Modal";

import "./TaskFormModal.css";

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 500;

interface TaskFormValue {
  title: string;
  description: string | null;
}

interface TaskFormModalProps {
  task?: Task | null;
  saving: boolean;
  onSubmit: (value: TaskFormValue) => Promise<void>;
  onClose: () => void;
}

export function TaskFormModal({
  task,
  saving,
  onSubmit,
  onClose,
}: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isEditing = Boolean(task);

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
  }, [task]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      return;
    }

    await onSubmit({
      title: normalizedTitle,
      description: normalizedDescription || null,
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="modal-header">
        <div>
          <h2>
            {isEditing
              ? "Изменить задачу"
              : "Создать задачу"}
          </h2>
        </div>

        <button
          className="modal-close"
          type="button"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <form
        className="task-form"
        onSubmit={handleSubmit}
      >
        <label className="field">
          <div className="field-header">
            <span>Название</span>

            <span className="hint">
              {title.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>

          <input
            value={title}
            maxLength={TITLE_MAX_LENGTH}
            placeholder="Закончить домашнее задание"
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </label>

        <label className="field">
          <div className="field-header">
            <span>Описание</span>

            <span className="hint">
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>

          <textarea
            value={description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            rows={5}
            placeholder="Сделать приложение 12 факторов до 02.10.2026 23:59 по МСК..."
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </label>

        <div className="modal-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Отмена
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={saving}
          >
            {saving
              ? "Сохраняем..."
              : isEditing
                ? "Сохранить"
                : "Создать"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}