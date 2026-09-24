import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Clock,
  CheckCircle,
  Eye,
  ChevronRight,
  Utensils,
  MapPin,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export const RecentOrders = ({ onSelectOrder }) => {
  const { orders, updateOrderStatus, setActiveTab, searchQuery } = useRestaurant();
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter orders
  let filteredOrders = [...orders];

  if (statusFilter !== 'All') {
    filteredOrders = filteredOrders.filter(
      o => o.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredOrders = filteredOrders.filter(
      o =>
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q))
    );
  }

  // Get status color class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'preparing':
        return 'preparing';
      case 'ready':
        return 'ready';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const advanceStatus = (e, order) => {
    e.stopPropagation();
    if (order.status === 'Pending') updateOrderStatus(order.id, 'Preparing');
    else if (order.status === 'Preparing') updateOrderStatus(order.id, 'Ready');
    else if (order.status === 'Ready') updateOrderStatus(order.id, 'Delivered');
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <ShoppingBag size={20} style={{ color: 'var(--accent-amber)' }} />
            Recent Kitchen & Delivery Orders
          </div>
          <div className="panel-subtitle">
            Live order statuses and progression
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => setActiveTab('orders')}
        >
          Order Board <ExternalLink size={13} />
        </button>
      </div>

      <div className="table-filter-bar">
        <div className="filter-left-group">
          {['All', 'Pending', 'Preparing', 'Ready', 'Delivered'].map(st => (
            <button
              key={st}
              className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Channel / Location</th>
              <th>Items Ordered</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-tertiary)' }}>
                  No orders matching the criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.slice(0, 6).map(order => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {order.id}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={order.customer.avatar}
                        alt={order.customer.name}
                        className="avatar-circle"
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{order.customer.name}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>
                          {order.customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {order.type === 'Dine-In' ? (
                        <>
                          <Utensils size={14} style={{ color: 'var(--accent-amber)' }} />
                          <span style={{ fontWeight: 600 }}>{order.tableNumber || 'Dine-in'}</span>
                        </>
                      ) : order.type === 'Delivery' ? (
                        <>
                          <MapPin size={14} style={{ color: 'var(--accent-indigo)' }} />
                          <span style={{ fontSize: '0.75rem' }} title={order.deliveryAddress}>
                            Delivery
                          </span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} style={{ color: 'var(--accent-emerald)' }} />
                          <span>Takeaway</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--accent-amber)' }}>
                    ${order.total.toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge-status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => advanceStatus(e, order)}
                          title={`Advance order to ${
                            order.status === 'Pending'
                              ? 'Preparing'
                              : order.status === 'Preparing'
                              ? 'Ready'
                              : 'Delivered'
                          }`}
                        >
                          Next Stage
                        </button>
                      )}
                      <button
                        className="btn-icon"
                        style={{ width: '30px', height: '30px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        title="View Full Bill Slip"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
