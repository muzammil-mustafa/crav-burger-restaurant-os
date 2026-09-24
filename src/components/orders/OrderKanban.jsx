import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Eye,
  Utensils,
  MapPin,
  ShoppingBag
} from 'lucide-react';

const COLUMNS = [
  { id: 'Pending', label: 'Pending Kitchen', color: 'var(--status-pending)' },
  { id: 'Preparing', label: 'In Kitchen Prep', color: 'var(--status-preparing)' },
  { id: 'Ready', label: 'Ready to Serve', color: 'var(--status-ready)' },
  { id: 'Delivered', label: 'Completed & Billed', color: 'var(--status-delivered)' }
];

export const OrderKanban = ({ orders, onSelectOrder }) => {
  const { updateOrderStatus } = useRestaurant();

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return 'Preparing';
      case 'Preparing':
        return 'Ready';
      case 'Ready':
        return 'Delivered';
      default:
        return null;
    }
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map(col => {
        const columnOrders = orders.filter(
          o => o.status.toLowerCase() === col.id.toLowerCase()
        );

        return (
          <div key={col.id} className="kanban-col">
            <div className="kanban-col-header">
              <div className="kanban-col-title">
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: col.color
                  }}
                />
                <span>{col.label}</span>
              </div>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-secondary)'
                }}
              >
                {columnOrders.length}
              </span>
            </div>

            <div className="kanban-card-list">
              {columnOrders.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '2rem 1rem',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.8rem'
                  }}
                >
                  No orders in this column
                </div>
              ) : (
                columnOrders.map(order => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <div
                      key={order.id}
                      className="kanban-card"
                      onClick={() => onSelectOrder(order)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="kanban-card-top">
                        <span className="kanban-order-id">{order.id}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          <Clock size={12} />
                          <span>{order.estimatedMinutes ? `${order.estimatedMinutes}m` : 'Just now'}</span>
                        </div>
                      </div>

                      <div className="kanban-customer">
                        <img
                          src={order.customer.avatar}
                          alt={order.customer.name}
                          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div className="kanban-customer-name">
                          {order.customer.name}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                        {order.type === 'Dine-In' ? (
                          <>
                            <Utensils size={12} style={{ color: 'var(--accent-amber)' }} />
                            <span>{order.tableNumber || 'Dine-in'}</span>
                          </>
                        ) : order.type === 'Delivery' ? (
                          <>
                            <MapPin size={12} style={{ color: 'var(--accent-indigo)' }} />
                            <span>Delivery</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={12} style={{ color: 'var(--accent-emerald)' }} />
                            <span>Takeout</span>
                          </>
                        )}
                      </div>

                      <div className="kanban-items-summary">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>

                      <div className="kanban-card-bottom">
                        <div className="kanban-total">
                          ${order.total.toFixed(2)}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            className="btn-icon"
                            style={{ width: '28px', height: '28px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectOrder(order);
                            }}
                            title="View Receipt"
                          >
                            <Eye size={13} />
                          </button>

                          {nextStatus && (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOrderStatus(order.id, nextStatus);
                              }}
                              title={`Advance to ${nextStatus}`}
                            >
                              <span>{nextStatus}</span>
                              <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
