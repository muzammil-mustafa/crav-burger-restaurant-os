import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Utensils,
  MapPin,
  CreditCard,
  Search,
  Check
} from 'lucide-react';

export const NewOrderModal = ({ isOpen, onClose }) => {
  const { menuItems, tables, createOrder } = useRestaurant();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState('Dine-In'); // 'Dine-In' | 'Takeaway' | 'Delivery'
  const [tableNumber, setTableNumber] = useState('Table 3');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [discount, setDiscount] = useState('0');

  // Order items map: { itemId: quantity }
  const [selectedItems, setSelectedItems] = useState({});
  const [menuSearch, setMenuSearch] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const availableItems = menuItems.filter(i => i.inStock);

  const filteredMenuItems = availableItems.filter(i =>
    i.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
    i.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  const updateQuantity = (itemId, delta) => {
    setSelectedItems(prev => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  // Calculate totals
  const subtotal = Object.entries(selectedItems).reduce((acc, [itemId, qty]) => {
    const item = menuItems.find(i => i.id === itemId);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const discountVal = parseFloat(discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discountVal);
  const tax = taxableAmount * 0.09;
  const total = taxableAmount + tax;

  const totalItemsCount = Object.values(selectedItems).reduce((a, b) => a + b, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!customerName.trim()) errs.customerName = 'Customer name is required';
    if (orderType === 'Delivery' && !deliveryAddress.trim()) {
      errs.deliveryAddress = 'Delivery address is required';
    }
    if (totalItemsCount === 0) {
      errs.items = 'Please select at least 1 menu item';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Build items payload
    const orderItems = Object.entries(selectedItems).map(([itemId, qty]) => {
      const item = menuItems.find(i => i.id === itemId);
      return {
        id: itemId,
        name: item.name,
        price: item.price,
        quantity: qty
      };
    });

    createOrder({
      customerName,
      customerPhone: customerPhone || '+1 (555) 000-1234',
      type: orderType,
      tableNumber: orderType === 'Dine-In' ? tableNumber : null,
      deliveryAddress: orderType === 'Delivery' ? deliveryAddress : null,
      paymentMethod,
      items: orderItems,
      subtotal,
      tax,
      discount: discountVal,
      total
    });

    // Reset and close
    setSelectedItems({});
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-up"
        style={{ maxWidth: '780px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <ShoppingBag size={20} style={{ color: 'var(--crav-red)' }} />
            <span>Create New Smashed Ticket</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="modal-body" style={{ maxHeight: '75vh' }}>
            {/* Customer Details Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Guest / Customer Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lucas Sterling"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                {errors.customerName && (
                  <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>
                    {errors.customerName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Contact</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+1 (555) 789-0123"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Order Channel Selection */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Service Channel</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['Dine-In', 'Takeaway', 'Delivery'].map(type => (
                    <button
                      type="button"
                      key={type}
                      className={`filter-chip ${orderType === type ? 'active' : ''}`}
                      onClick={() => setOrderType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {orderType === 'Dine-In' ? (
                <div className="form-group">
                  <label className="form-label">Assign Table</label>
                  <select
                    className="form-select"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  >
                    {tables.map(tbl => (
                      <option key={tbl.id} value={tbl.name}>
                        {tbl.name} ({tbl.seats} seats - {tbl.status})
                      </option>
                    ))}
                  </select>
                </div>
              ) : orderType === 'Delivery' ? (
                <div className="form-group">
                  <label className="form-label">Delivery Address *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter street & apartment..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  {errors.deliveryAddress && (
                    <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>
                      {errors.deliveryAddress}
                    </span>
                  )}
                </div>
              ) : null}
            </div>

            {/* Menu Item Picker */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="form-label">Add Items from Menu *</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  {totalItemsCount} items selected (${subtotal.toFixed(2)})
                </span>
              </div>

              <div className="filter-search-box" style={{ marginBottom: '0.65rem' }}>
                <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Quick search dishes..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                />
              </div>

              {errors.items && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  {errors.items}
                </div>
              )}

              <div
                style={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {filteredMenuItems.map(item => {
                  const qty = selectedItems[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.85rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: qty > 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={qty === 0}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontWeight: 700, width: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: '28px', height: '28px', backgroundColor: 'var(--bg-elevated)' }}
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Calculation */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Cash">Cash at Counter</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">VIP / Staff Discount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="form-input"
                  placeholder="0.00"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
            </div>

            {/* Bill Preview Bar */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Subtotal: ${subtotal.toFixed(2)} + Tax (9%): ${tax.toFixed(2)}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  Final: ${total.toFixed(2)}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {totalItemsCount} dishes selected
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={totalItemsCount === 0}
            >
              Send to Flat-Top Plancha (${total.toFixed(2)})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
