import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Award, Star, ArrowUpRight } from 'lucide-react';

export const TopItemsWidget = () => {
  const { menuItems, setActiveTab } = useRestaurant();

  // Sort items by order count descending
  const topItems = [...menuItems]
    .sort((a, b) => (b.ordersCount || 0) - (a.ordersCount || 0))
    .slice(0, 5);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <Award size={20} style={{ color: 'var(--accent-amber)' }} />
            Bestselling Dishes
          </div>
          <div className="panel-subtitle">Top customer favorites by volume</div>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setActiveTab('menu')}
        >
          View Menu <ArrowUpRight size={13} />
        </button>
      </div>

      <div className="top-items-list">
        {topItems.map((item, index) => (
          <div key={item.id} className="top-item-row">
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: index === 0 ? 'var(--accent-amber)' : 'var(--bg-muted)',
                color: index === 0 ? '#fff' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              #{index + 1}
            </div>

            <img
              src={item.image}
              alt={item.name}
              className="top-item-image"
              loading="lazy"
            />

            <div className="top-item-details">
              <div className="top-item-name">{item.name}</div>
              <div className="top-item-cat" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{item.category}</span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--accent-amber)' }}>
                  <Star size={11} fill="currentColor" /> {item.rating}
                </span>
              </div>
            </div>

            <div className="top-item-stats">
              <div className="top-item-price">${item.price.toFixed(2)}</div>
              <div className="top-item-orders">{item.ordersCount} ordered</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
