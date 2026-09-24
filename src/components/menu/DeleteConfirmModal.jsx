import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AlertTriangle, X } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, itemToDelete }) => {
  const { deleteMenuItem } = useRestaurant();

  if (!isOpen || !itemToDelete) return null;

  const handleDelete = () => {
    deleteMenuItem(itemToDelete.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-up"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--accent-rose)' }}>
            <AlertTriangle size={20} />
            <span>Confirm Deletion</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Are you sure you want to remove <strong>"{itemToDelete.name}"</strong> from your menu? This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Keep Item
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Yes, Remove Dish
          </button>
        </div>
      </div>
    </div>
  );
};
