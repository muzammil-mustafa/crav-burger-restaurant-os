import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useRestaurant();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />;
      case 'error':
        return <AlertCircle size={18} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />;
      case 'info':
      default:
        return <Info size={18} style={{ color: 'var(--accent-indigo)', flexShrink: 0 }} />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          {getIcon(toast.type)}
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="btn-icon"
            style={{ width: '24px', height: '24px', border: 'none', background: 'transparent' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
