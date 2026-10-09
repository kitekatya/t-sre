import { Button } from "./Button";
import { Modal } from "./Modal";

import "./ConfirmModal.css";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  title,
  description,
  confirmText = "Удалить",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal
      onClose={onClose}
      className="delete-modal"
    >
      <div className="delete-icon">
        !
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <div className="modal-actions">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Отмена
        </Button>

        <Button
          variant="danger"
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}