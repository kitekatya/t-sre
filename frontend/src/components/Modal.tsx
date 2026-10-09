import type { ReactNode } from "react";

import "./Modal.css";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export function Modal({
  children,
  onClose,
  className = "",
}: ModalProps) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className={`modal ${className}`}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {children}
      </div>
    </div>
  );
}