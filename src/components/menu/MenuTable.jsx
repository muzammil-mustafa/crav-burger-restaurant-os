import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Edit2, Trash2, Star, Clock } from 'lucide-react';

export const MenuTable = ({ items, onEdit, onDelete }) => {
  const { toggleStock } = useRestaurant();

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Dish</th>
            <th>Category</th>
            <th>Price</th>
            <th>Cost</th>
            <th>Margin</th>
            <th>Prep</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const margin = item.price > 0 ? (((item.price - (item.cost || 0)) / item.price) * 100).toFixed(0) : 0;
            return (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', display: 'flex', gap: '0.35rem' }}>
                        <span>★ {item.rating}</span>
                        <span>•</span>
                        <span>{item.ordersCount} sold</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-muted)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {item.category}
                  </span>
                </td>
                <td style={{ fontWeight: 800, color: 'var(--accent-amber)' }}>
                  ${item.price.toFixed(2)}
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  ${(item.cost || 0).toFixed(2)}
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: margin >= 65 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                    {margin}%
                  </span>
                </td>
                <td style={{ color: 'var(--text-tertiary)' }}>
                  {item.prepTime || 15}m
                </td>
                <td>
                  <label className="stock-toggle-label">
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={item.inStock}
                        onChange={() => toggleStock(item.id)}
                      />
                      <span className="toggle-slider" />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: item.inStock ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                      {item.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </label>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      className="btn-icon"
                      style={{ width: '30px', height: '30px' }}
                      onClick={() => onEdit(item)}
                      title="Edit Item"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width: '30px', height: '30px', color: 'var(--accent-rose)' }}
                      onClick={() => onDelete(item)}
                      title="Delete Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
