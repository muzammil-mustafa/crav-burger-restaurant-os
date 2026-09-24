import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CATEGORIES } from '../../data/mockData';
import { MenuItemCard } from './MenuItemCard';
import { MenuTable } from './MenuTable';
import { AddEditItemModal } from './AddEditItemModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import {
  UtensilsCrossed,
  Plus,
  LayoutGrid,
  List,
  Search,
  Flame,
  Sparkles
} from 'lucide-react';

export const MenuManagement = () => {
  const { menuItems, searchQuery } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  const [localSearch, setLocalSearch] = useState('');
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter items
  const query = (localSearch || searchQuery).toLowerCase().trim();

  let filtered = menuItems.filter(item => {
    // Category match
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    // Stock filter
    if (stockFilter === 'inStock' && !item.inStock) return false;
    if (stockFilter === 'outOfStock' && item.inStock) return false;

    // Search query match
    if (query) {
      const matchName = item.name.toLowerCase().includes(query);
      const matchDesc = (item.description || '').toLowerCase().includes(query);
      const matchTags = (item.tags || []).some(t => t.toLowerCase().includes(query));
      const matchCat = (item.category || '').toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchTags && !matchCat) return false;
    }

    return true;
  });

  // Sort filtered items
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popular':
      default:
        return (b.ordersCount || 0) - (a.ordersCount || 0);
    }
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsAddEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    setItemToDelete(item);
  };

  return (
    <div className="page-container">
      {/* CRAV Dedicated Hero Banner */}
      <div className="page-hero-banner">
        <div>
          <div className="breadcrumbs">
            <span>CRAV OS</span> / <span>Catalog</span> / <strong>Smashed Burgers & Recipes</strong>
          </div>
          <div className="page-hero-title">
            <span>CRAV MENU & FLAT-TOP RECIPES</span>
            <span className="crav-sticker crav-sticker-red">
              {menuItems.length} SIGNATURE ITEMS
            </span>
          </div>
          <p className="page-hero-subtitle">
            Hand-smashed prime patties, melted cheddar, chili honey glazes, and toasted brioche. Manage recipes, live stock availability, and prices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add Smashed Item</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="panel-card" style={{ padding: '1.25rem', gap: '1rem' }}>
        {/* Categories Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map(cat => {
            const count = cat === 'All' ? menuItems.length : menuItems.filter(i => i.category === cat).length;
            return (
              <button
                key={cat}
                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    opacity: 0.9,
                    marginLeft: '5px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: selectedCategory === cat ? 'rgba(0,0,0,0.25)' : 'var(--bg-card)'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Second Filter Row */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <div className="filter-search-box">
              <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search burgers, ingredients, sauces..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Stock:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="All">All Items</option>
                <option value="inStock">Available on Flat-Top</option>
                <option value="outOfStock">Sold Out</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Sort:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Ordered</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: viewMode === 'grid' ? 'var(--crav-red)' : 'var(--bg-card)',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-secondary)',
                borderColor: viewMode === 'grid' ? 'var(--crav-red)' : 'var(--border-subtle)'
              }}
              onClick={() => setViewMode('grid')}
              title="Visual Cards View"
            >
              <LayoutGrid size={16} />
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
              title="Inventory Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Food Items Content */}
      {filtered.length === 0 ? (
        <div
          className="panel-card"
          style={{
            textAlign: 'center',
            padding: '4.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <Flame size={54} style={{ color: 'var(--crav-red)', opacity: 0.6 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900 }}>
              No CRAV items matched your search
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
              Try adjusting your category, stock filters, or search terms.
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSelectedCategory('All');
              setStockFilter('All');
              setLocalSearch('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="menu-grid">
          {filtered.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      ) : (
        <MenuTable
          items={filtered}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Modals */}
      <AddEditItemModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        editingItem={editingItem}
      />

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        itemToDelete={itemToDelete}
      />
    </div>
  );
};
