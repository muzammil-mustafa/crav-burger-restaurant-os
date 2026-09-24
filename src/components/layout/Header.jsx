import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Menu,
  Search,
  X,
  Sun,
  Moon,
  PlusCircle,
  Bell,
  CheckCheck,
  Flame,
  MapPin
} from 'lucide-react';

export const Header = ({ onOpenNewOrder }) => {
  const {
    theme,
    toggleTheme,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    notifications,
    setNotifications
  } = useRestaurant();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="btn-icon mobile-menu-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="global-search-box">
          <Search size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search smash burgers, ticket #, guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="topbar-right">
        {/* Store Location Badge */}
        <div className="store-location-pill" style={{ display: 'none', '@media (minWidth: 992px)': { display: 'flex' } }}>
          <MapPin size={13} style={{ color: 'var(--crav-red)' }} />
          <span>Navarra, España</span>
        </div>

        {/* Quick New Order Button */}
        <button
          className="btn btn-primary"
          onClick={onOpenNewOrder}
          title="Create New Smash Order"
        >
          <Flame size={16} fill="currentColor" />
          <span>New Order</span>
        </button>

        {/* GitHub Repository Link */}
        <a
          href="https://github.com/muzammil-mustafa/crav-burger-restaurant-os"
          target="_blank"
          rel="noreferrer"
          className="btn-icon"
          title="View GitHub Repository"
          aria-label="GitHub Profile"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>

        {/* Theme Toggle Button */}
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Warm Toasted Light' : 'Charred Flat-Top Dark'} theme`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={19} style={{ color: 'var(--crav-cheddar)' }} />
          ) : (
            <Moon size={19} style={{ color: 'var(--crav-red)' }} />
          )}
        </button>

        {/* Notifications Popover Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            onClick={() => setShowNotifications(prev => !prev)}
            title="Kitchen & Dispatch Alerts"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '7px',
                  right: '7px',
                  width: '9px',
                  height: '9px',
                  backgroundColor: 'var(--crav-red)',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px var(--crav-red)'
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              className="animate-scale-up"
              style={{
                position: 'absolute',
                top: '48px',
                right: '0',
                width: '320px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 50,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.85rem' }}>
                  Flat-Top & Dispatch Alerts
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    style={{
                      fontSize: '0.725rem',
                      color: 'var(--crav-red)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCheck size={13} /> Mark read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {notifications.map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: item.unread ? 'rgba(255, 69, 26, 0.08)' : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: item.unread ? 600 : 400 }}>
                      {item.text}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile-btn">
          <div
            className="avatar-fallback"
            style={{
              background: 'linear-gradient(135deg, var(--crav-red), var(--crav-cheddar))',
              fontFamily: 'var(--font-display)',
              fontWeight: 900
            }}
          >
            CB
          </div>
          <div className="user-meta" style={{ display: 'none', '@media (minWidth: 640px)': { display: 'block' } }}>
            <div className="user-meta-name" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>
              CRAV Manager
            </div>
            <div className="user-meta-role">Navarra Head Chef</div>
          </div>
        </div>
      </div>
    </header>
  );
};
