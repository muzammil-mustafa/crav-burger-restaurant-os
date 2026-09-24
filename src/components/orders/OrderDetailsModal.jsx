import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  X,
  Printer,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Receipt
} from 'lucide-react';

export const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const { updateOrderStatus, cancelOrder, addToast } = useRestaurant();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    addToast('Print Triggered', `Kitchen docket for ${order.id} sent to thermal printer.`, 'info');
  };

  const formattedDate = new Date(order.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-up"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <Receipt size={20} style={{ color: 'var(--crav-red)' }} />
            <span>CRAV Docket #{order.id}</span>
            <span className={`badge-status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button className="btn-icon" onClick={handlePrint} title="Print Ticket">
              <Printer size={16} />
            </button>
            <button className="btn-icon" onClick={onClose} aria-label="Close modal">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Order Meta Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem',
              padding: '0.85rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Order Type
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Utensils size={14} style={{ color: 'var(--accent-amber)' }} />
                <span>{order.type} {order.tableNumber ? `(${order.tableNumber})` : ''}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Placed At
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} style={{ color: 'var(--accent-indigo)' }} />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Payment
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>
                {order.paymentMethod} • <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Customer Profile Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={order.customer.avatar}
                alt={order.customer.name}
                className="avatar-circle"
              />
              <div>
                <div style={{ fontWeight: 700 }}>{order.customer.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  {order.customer.phone} • {order.customer.email}
                </div>
              </div>
            </div>

            {order.deliveryAddress && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} style={{ color: 'var(--accent-amber)' }} />
                <span>{order.deliveryAddress}</span>
              </div>
            )}
          </div>

          {/* Itemized List */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Items Summary ({order.items.length} dishes)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--accent-amber)', marginRight: '6px' }}>
                        {item.quantity}x
                      </span>
                      {item.name}
                    </div>
                    {item.note && (
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: '2px' }}>
                        Note: {item.note}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Calculation */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              fontSize: '0.825rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Kitchen Tax (9%):</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)' }}>
                <span>VIP Discount:</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                fontWeight: 800,
                fontSize: '1.05rem',
                color: 'var(--text-primary)'
              }}
            >
              <span>Total Amount:</span>
              <span style={{ color: 'var(--accent-amber)' }}>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Quick Status Updater Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Change Order Stage
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Pending', 'Preparing', 'Ready', 'Delivered'].map(status => (
                <button
                  key={status}
                  className={`btn btn-sm ${order.status === status ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateOrderStatus(order.id, status)}
                >
                  {status}
                </button>
              ))}
              {order.status !== 'Cancelled' && (
                <button
                  className="btn btn-sm btn-danger"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => {
                    cancelOrder(order.id, 'Cancelled via receipt modal');
                    onClose();
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Receipt
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={15} /> Print Kitchen Docket
          </button>
        </div>
      </div>
    </div>
  );
};
