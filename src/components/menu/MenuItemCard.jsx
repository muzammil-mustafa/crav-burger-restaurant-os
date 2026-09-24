import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Clock,
  Flame,
  Star,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const MenuItemCard = ({ item, onEdit, onDelete }) => {
  const { toggleStock } = useRestaurant();

  return (
    <div className="food-card">
      <div className="food-card-thumb-wrap">
        <img
          src={item.image}
          alt={item.name}
          className="food-card-thumb"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
          }}
        />

        <div className="food-card-badge-row">
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {item.tags && item.tags.map(tag => (
              <span key={tag} className="food-tag-pill">
                {tag}
              </span>
            ))}
          </div>

          <span
            className={`stock-tag-pill ${item.inStock ? 'in-stock' : 'out-stock'}`}
          >
            {item.inStock ? 'In Stock' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="food-card-body">
        <div className="food-card-header">
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
              {item.category}
            </div>
            <div className="food-card-title">{item.name}</div>
          </div>
          <div className="food-card-price">${item.price.toFixed(2)}</div>
        </div>

        <p className="food-card-desc">{item.description}</p>

        <div className="food-card-meta">
          <div className="food-meta-item">
            <Clock size={13} style={{ color: 'var(--accent-amber)' }} />
            <span>{item.prepTime || 15} mins</span>
          </div>

          <div className="food-meta-item">
            <Flame size={13} style={{ color: 'var(--accent-rose)' }} />
            <span>{item.calories || 450} kcal</span>
          </div>

          <div className="food-meta-item" style={{ marginLeft: 'auto', color: 'var(--accent-amber)' }}>
            <Star size={13} fill="currentColor" />
            <span style={{ fontWeight: 700 }}>{item.rating || 4.8}</span>
          </div>
        </div>

        <div className="food-card-actions">
          {/* In Stock toggle */}
          <label className="stock-toggle-label" title="Toggle item availability">
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={item.inStock}
                onChange={() => toggleStock(item.id)}
              />
              <span className="toggle-slider" />
            </div>
            <span style={{ fontSize: '0.75rem' }}>{item.inStock ? 'Available' : 'Out of stock'}</span>
          </label>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={() => onEdit(item)}
              title="Edit Dish"
            >
              <Edit2 size={14} />
            </button>
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px', color: 'var(--accent-rose)' }}
              onClick={() => onDelete(item)}
              title="Delete Dish"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
