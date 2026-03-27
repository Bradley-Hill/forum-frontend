import type { ModalProps } from '../../types/components';
import { useEffect, useRef, useCallback } from 'react';
import { MdClose } from 'react-icons/md';
import './Modal.scss';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  children,
  className = '',
  closeOnBackdropClick = true,
  closeOnEscapeKey = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || !closeOnEscapeKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscapeKey, onClose]);

  // Trap focus inside modal and restore on close
  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before modal opened
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      previousFocusRef.current = activeElement;
    }

    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Cleanup: restore focus on close
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose]
  );

  if (!isOpen) return null;

  const modalClasses = ['modal', `modal--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          <MdClose />
        </button>

        {title && <h2 id="modal-title" className="modal-title">{title}</h2>}

        {children}
      </div>
    </div>
  );
};

export default Modal;
