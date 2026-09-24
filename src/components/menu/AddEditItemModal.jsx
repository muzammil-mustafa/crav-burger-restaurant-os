import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CATEGORIES } from '../../data/mockData';
import { X, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Classic Smash', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Spicy Jalapeño', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80' },
  { label: 'Bacon Smashed', url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Triple Monster', url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80' },
  { label: 'Loaded Fries', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80' },
  { label: 'Caramel Shake', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chili Wings', url: 'https://images.unsplash.com/photo-1527477378308-140ae2443325?auto=format&fit=crop&w=600&q=80' },
  { label: 'Skillet Cookie', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' }
];

const AVAILABLE_TAGS = ['Top Classic', 'Smashed Fresh', 'Bestseller', 'Spicy', 'High Protein', 'Chili Glazed', 'Loaded', 'Veggie'];

export const AddEditItemModal = ({ isOpen, onClose, editingItem }) => {
  const { addMenuItem, updateMenuItem } = useRestaurant();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Smashed Burgers',
    price: '',
    cost: '',
    prepTime: '9',
    calories: '650',
    description: '',
    image: PRESET_IMAGES[0].url,
    inStock: true,
    tags: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        category: editingItem.category || 'Mains',
        price: editingItem.price !== undefined ? String(editingItem.price) : '',
        cost: editingItem.cost !== undefined ? String(editingItem.cost) : '',
        prepTime: editingItem.prepTime !== undefined ? String(editingItem.prepTime) : '15',
        calories: editingItem.calories !== undefined ? String(editingItem.calories) : '500',
        description: editingItem.description || '',
        image: editingItem.image || PRESET_IMAGES[0].url,
        inStock: editingItem.inStock !== false,
        tags: editingItem.tags || []
      });
    } else {
      setFormData({
        name: '',
        category: 'Mains',
        price: '',
        cost: '',
        prepTime: '15',
        calories: '500',
        description: '',
        image: PRESET_IMAGES[0].url,
        inStock: true,
        tags: []
      });
    }
    setErrors({});
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Dish name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) errs.price = 'Valid price is required';
    if (formData.cost && parseFloat(formData.cost) < 0) errs.cost = 'Cost cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost) || 0,
        prepTime: parseInt(formData.prepTime, 10) || 15,
        calories: parseInt(formData.calories, 10) || 450
      });
    } else {
      addMenuItem({
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost) || 0,
        prepTime: parseInt(formData.prepTime, 10) || 15,
        calories: parseInt(formData.calories, 10) || 450
      });
    }
    onClose();
  };

  const validCategories = CATEGORIES.filter(c => c !== 'All');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={18} style={{ color: 'var(--accent-amber)' }} />
            <span>{editingItem ? 'Edit Culinary Item' : 'Add New Food / Drink Item'}</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Dish Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Truffle Burrata Gnocchi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && (
                <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>{errors.name}</span>
              )}
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {validCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Selling Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="24.50"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                {errors.price && (
                  <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>{errors.price}</span>
                )}
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Cost to Cook ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="7.50"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prep Time (mins)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="15"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Calories (kcal)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="550"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description & Ingredients</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Describe flavor notes, plating details, and key ingredients..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Tags selection */}
            <div className="form-group">
              <label className="form-label">Dietary & Chef Highlights</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {AVAILABLE_TAGS.map(tag => {
                  const isSelected = formData.tags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      className={`filter-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => handleTagToggle(tag)}
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Preview & Presets */}
            <div className="form-group">
              <label className="form-label">Photo Presentation</label>
              <input
                type="text"
                className="form-input"
                placeholder="Paste image URL..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />

              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                Or select from culinary photo presets:
              </div>
              <div className="preset-image-grid">
                {PRESET_IMAGES.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset.url}
                    alt={preset.label}
                    title={preset.label}
                    className={`preset-thumb ${formData.image === preset.url ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, image: preset.url })}
                  />
                ))}
              </div>
            </div>

            {/* Availability */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Immediate Kitchen Availability</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>Can guests order this item right now?</div>
              </div>
              <label className="stock-toggle-label">
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </div>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Save Changes' : 'Create Menu Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
