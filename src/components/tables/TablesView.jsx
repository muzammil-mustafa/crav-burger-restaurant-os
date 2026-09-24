import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Armchair,
  Users,
  CheckCircle,
  Clock,
  Receipt,
  Flame,
  Utensils
} from 'lucide-react';

export const TablesView = ({ onSelectOrderById }) => {
  const { tables, setTables, orders, addToast } = useRestaurant();
  const [sectionFilter, setSectionFilter] = useState('All');

  const sections = ['All', 'Diner Booths', 'Flat-Top Bar', 'Patio Terrace', 'Center Hall'];

  const filteredTables = sectionFilter === 'All'
    ? tables
    : tables.filter(t => t.section === sectionFilter);

  const toggleStatus = (table) => {
    let nextStatus = 'Available';
    if (table.status === 'Available') nextStatus = 'Occupied';
    else if (table.status === 'Occupied') nextStatus = 'Reserved';
    else nextStatus = 'Available';

    setTables(prev =>
      prev.map(t => (t.id === table.id ? { ...t, status: nextStatus } : t))
    );

    addToast('Table Updated', `${table.name} marked as ${nextStatus}`, 'info');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return { bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e', text: 'var(--crav-pickle-green)' };
      case 'Occupied':
        return { bg: 'var(--crav-red-glow)', border: 'var(--crav-red)', text: 'var(--crav-red)' };
      case 'Reserved':
        return { bg: 'var(--crav-cheddar-glow)', border: 'var(--crav-cheddar)', text: 'var(--crav-cheddar)' };
      default:
        return { bg: 'var(--bg-muted)', border: 'var(--border-subtle)', text: 'var(--text-secondary)' };
    }
  };

  const availableCount = tables.filter(t => t.status === 'Available').length;
  const occupiedCount = tables.filter(t => t.status === 'Occupied').length;
  const reservedCount = tables.filter(t => t.status === 'Reserved').length;

  return (
    <div className="page-container">
      {/* CRAV Dedicated Hero Banner */}
      <div className="page-hero-banner">
        <div>
          <div className="breadcrumbs">
            <span>CRAV OS</span> / <span>Hospitality</span> / <strong>Diner Booths & Bar Seating</strong>
          </div>
          <div className="page-hero-title">
            <span>DINER SEATING & FLAT-TOP COUNTER</span>
            <span className="crav-sticker crav-sticker-red">
              {tables.length} SEATING STATIONS
            </span>
          </div>
          <p className="page-hero-subtitle">
            Dine-in burger service across retro diner booths, front-row flat-top bar stools, and outdoor patio tables in Navarra.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.825rem',
              fontWeight: 800,
              display: 'flex',
              gap: '0.85rem'
            }}
          >
            <span style={{ color: 'var(--crav-pickle-green)' }}>🟢 {availableCount} Free</span>
            <span style={{ color: 'var(--crav-red)' }}>🔴 {occupiedCount} Eating</span>
            <span style={{ color: 'var(--crav-cheddar)' }}>🟡 {reservedCount} Booked</span>
          </div>
        </div>
      </div>

      {/* Section Filter */}
      <div className="panel-card" style={{ padding: '0.95rem 1.35rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {sections.map(sec => (
            <button
              key={sec}
              className={`filter-chip ${sectionFilter === sec ? 'active' : ''}`}
              onClick={() => setSectionFilter(sec)}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Table Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '1.35rem'
        }}
      >
        {filteredTables.map(tbl => {
          const colors = getStatusColor(tbl.status);
          const activeOrder = orders.find(o => o.id === tbl.activeOrder);

          return (
            <div
              key={tbl.id}
              className="panel-card"
              style={{
                borderLeft: `5px solid ${colors.border}`,
                padding: '1.35rem',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem' }}>
                    {tbl.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                    {tbl.section}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-display)',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase'
                  }}
                >
                  {tbl.status}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <Users size={16} style={{ color: 'var(--crav-cheddar)' }} />
                <span>{tbl.seats} Guests Seated</span>
              </div>

              {tbl.status === 'Occupied' && activeOrder ? (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.775rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Active Ticket:</span>
                    <span style={{ color: 'var(--crav-red)', fontWeight: 900 }}>{activeOrder.id}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {activeOrder.customer.name} • ${activeOrder.total.toFixed(2)}
                  </div>
                </div>
              ) : tbl.status === 'Reserved' ? (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.775rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                >
                  {tbl.reservedFor || 'Reserved for evening dine-in'}
                </div>
              ) : (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.775rem',
                    color: 'var(--crav-pickle-green)',
                    fontWeight: 800
                  }}
                >
                  Available for walk-in guest seating
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => toggleStatus(tbl)}
                >
                  Change Status
                </button>

                {activeOrder && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectOrderById(activeOrder.id)}
                    title="View Table Receipt"
                  >
                    <Receipt size={13} /> Ticket
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
