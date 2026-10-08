import { useEffect, useRef } from 'react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  // Move focus to cancel button when dialog opens
  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 mx-4 w-full max-w-sm">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-heading mb-2">
          {title}
        </h2>
        <p id="confirm-dialog-message" className="text-sm text-gray-500 mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <Button ref={cancelRef as React.Ref<HTMLButtonElement>} variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-danger text-white rounded-2xl px-6 py-3 font-semibold
              focus:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2
              transition-opacity hover:opacity-90"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
