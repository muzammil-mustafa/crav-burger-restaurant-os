import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Flame,
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  TrendingUp,
  Armchair,
  Settings,
  X,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    activeOrdersCount,
    menuItems
  } = useRestaurant();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'orders',
      label: 'Flat-Top Order Hub',
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} live` : null,
      badgeType: 'crav'
    },
    {
      id: 'menu',
      label: 'CRAV Menu Catalog',
      icon: UtensilsCrossed,
      badge: menuItems.length,
      badgeType: 'subtle'
    },
    {
      id: 'analytics',
      label: 'Financials & Costs',
      icon: TrendingUp,
      badge: null
    },
    {
      id: 'tables',
      label: 'Diner Floor & Bar',
      icon: Armchair,
      badge: null
    },
    {
      id: 'settings',
      label: 'Store Config & Brand',
      icon: Settings,
      badge: null
    }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-flame-box">
              <Flame size={24} fill="currentColor" />
            </div>
            <div>
              <div className="brand-logo-text">
                CRAV <span className="brand-badge-est">EST. 1997</span>
              </div>
              <div className="brand-subtext">Smashed Fresh · Bold Flavor</div>
            </div>
          </div>
          <button
            className="btn-icon mobile-menu-toggle"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-content">
          <div>
            <div className="nav-group-title">Live Kitchen & Sales</div>
            <ul className="nav-list">
              {navItems.slice(0, 3).map(item => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      className={`nav-item-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      <IconComponent size={20} className="nav-icon" />
                      <span>{item.label}</span>
                      {item.badge !== null && (
                        <span
                          className="nav-badge"
                          style={
                            item.badgeType === 'subtle'
                              ? { background: 'var(--bg-muted)', color: 'var(--text-secondary)' }
                              : {}
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="nav-group-title">Business & Operations</div>
            <ul className="nav-list">
              {navItems.slice(3).map(item => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      className={`nav-item-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      <IconComponent size={20} className="nav-icon" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-flat-top-status">
            <div className="flame-dot" />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                Flat-Top Sizzling
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                Navarra España · Calle del Sabor 12
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
