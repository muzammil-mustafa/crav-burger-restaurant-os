import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderKanban } from './OrderKanban';
import { OrderDetailsModal } from './OrderDetailsModal';
import { NewOrderModal } from './NewOrderModal';
import {
  ShoppingBag,
  Plus,
  Kanban,
  List,
  Search,
  Filter,
  Flame,
  Utensils,
  MapPin,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const OrderManagement = ({ isNewOrderOpen, setIsNewOrderOpen, selectedOrder, setSelectedOrder }) => {
  const { orders, updateOrderStatus, searchQuery } = useRestaurant();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [localSearch, setLocalSearch] = useState('');

  // Filter orders
  const query = (localSearch || searchQuery).toLowerCase().trim();

  let filtered = [...orders].filter(order => {
    // Status
    if (statusFilter !== 'All' && order.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    // Type
    if (typeFilter !== 'All' && order.type !== typeFilter) {
      return false;
    }
    // Search query
    if (query) {
      const matchId = order.id.toLowerCase().includes(query);
      const matchName = order.customer.name.toLowerCase().includes(query);
      const matchPhone = (order.customer.phone || '').toLowerCase().includes(query);
      const matchItems = order.items.some(i => i.name.toLowerCase().includes(query));
      if (!matchId && !matchName && !matchPhone && !matchItems) return false;
    }
    return true;
  });

  return (
    <div className="page-container">
      {/* CRAV Dedicated Hero Banner */}
      <div className="page-hero-banner">
        <div>
          <div className="breadcrumbs">
            <span>CRAV OS</span> / <span>Kitchen Operations</span> / <strong>Flat-Top Order Hub</strong>
          </div>
          <div className="page-hero-title">
            <span>FLAT-TOP ORDER PIPELINE</span>
            <span className="crav-sticker crav-sticker-cheddar">
              {orders.length} ACTIVE TICKETS
            </span>
          </div>
          <p className="page-hero-subtitle">
            Every burger smashed fresh to order on the 450°F flat-top. Real-time ticket pacing from grill to table, counter, and delivery dispatch.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setIsNewOrderOpen(true)}>
            <Flame size={16} fill="currentColor" />
            <span>Create Smashed Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="panel-card" style={{ padding: '1.25rem', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Status Pills */}
            {['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map(st => (
              <button
                key={st}
                className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              className={`btn-icon ${viewMode === 'kanban' ? 'active' : ''}`}
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: viewMode === 'kanban' ? 'var(--crav-red)' : 'var(--bg-card)',
                color: viewMode === 'kanban' ? '#fff' : 'var(--text-secondary)',
                borderColor: viewMode === 'kanban' ? 'var(--crav-red)' : 'var(--border-subtle)'
              }}
              onClick={() => setViewMode('kanban')}
              title="Kanban Griddle Board"
            >
              <Kanban size={16} />
            </button>
            <button
              className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: viewMode === 'table' ? 'var(--crav-red)' : 'var(--bg-card)',
                color: viewMode === 'table' ? '#fff' : 'var(--text-secondary)',
                borderColor: viewMode === 'table' ? 'var(--crav-red)' : 'var(--border-subtle)'
              }}
              onClick={() => setViewMode('table')}
              title="Table Audit List"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div className="filter-search-box">
            <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by ticket #, customer, burger..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Service Channel:
            </span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.825rem', fontWeight: 700 }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Channels</option>
              <option value="Dine-In">Dine-In Booths & Counter</option>
              <option value="Takeaway">Takeaway Express</option>
              <option value="Delivery">Delivery Couriers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Kanban or Table */}
      {viewMode === 'kanban' ? (
        <OrderKanban orders={filtered} onSelectOrder={setSelectedOrder} />
      ) : (
        <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="data-table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Customer</th>
                  <th>Channel / Seating</th>
                  <th>Smashed Items</th>
                  <th>Time Placed</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-tertiary)' }}>
                      No orders found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map(order => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--crav-red)' }}>
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
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{order.customer.name}</div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>
                              {order.customer.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {order.type === 'Dine-In' ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                            <Utensils size={13} style={{ color: 'var(--crav-cheddar)' }} />
                            {order.tableNumber || 'Dine-In'}
                          </span>
                        ) : order.type === 'Delivery' ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <MapPin size={13} style={{ color: 'var(--crav-red)' }} />
                            Delivery
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <ShoppingBag size={13} style={{ color: 'var(--crav-pickle-green)' }} />
                            Takeaway
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 600 }}>
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--crav-red)' }}>
                        ${order.total.toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge-status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-icon"
                          style={{ width: '32px', height: '32px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          title="View Receipt Docket"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />

      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
      />
    </div>
  );
};
