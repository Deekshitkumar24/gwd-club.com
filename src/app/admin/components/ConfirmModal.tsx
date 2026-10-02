'use client';

import React from 'react';
import styles from '../admin.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className={styles.modalContent}
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 id="confirm-modal-title" className={styles.modalTitle} style={{ color: isDestructive ? 'var(--brand-red)' : 'inherit' }}>
            {title}
          </h3>
          <button type="button" className={styles.modalClose} onClick={onCancel} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {message}
          </p>
        </div>

        <div className={styles.modalFooter} style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={isDestructive ? 'btn btn-primary' : 'btn btn-primary'}
            style={isDestructive ? { background: 'var(--brand-red)', borderColor: 'var(--brand-red)' } : {}}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
