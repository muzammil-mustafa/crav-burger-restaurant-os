import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Settings,
  Sun,
  Moon,
  RotateCcw,
  Download,
  Building,
  DollarSign,
  ShieldCheck,
  Save,
  Flame,
  Check,
  MapPin
} from 'lucide-react';

export const SettingsView = () => {
  const {
    theme,
    toggleTheme,
    resetToDefaultData,
    menuItems,
    orders,
    tables,
    expenses,
    addToast
  } = useRestaurant();

  const [restaurantName, setRestaurantName] = useState('CRAV Burger — Navarra Flagship');
  const [address, setAddress] = useState('Calle del Sabor 12, Navarra, España');
  const [phone, setPhone] = useState('+34 948 000 123');
  const [currency, setCurrency] = useState('$ (USD)');
  const [taxRate, setTaxRate] = useState('9.0');
  const [tableCount, setTableCount] = useState('12');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    addToast('Configuration Saved', 'CRAV store and location settings updated.', 'success');
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      brand: 'CRAV Burger — Smashed Fresh, Bold Flavor',
      est: '1997',
      location: { name: restaurantName, address, phone, taxRate, currency },
      menuItems,
      orders,
      tables,
      expenses
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crav-burger-data-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    addToast('Data Exported', 'CRAV JSON snapshot downloaded.', 'success');
  };

  return (
    <div className="page-container" style={{ maxWidth: '920px' }}>
      {/* CRAV Dedicated Hero Banner */}
      <div className="page-hero-banner">
        <div>
          <div className="breadcrumbs">
            <span>CRAV OS</span> / <span>System Config</span> / <strong>Store & Brand Identity</strong>
          </div>
          <div className="page-hero-title">
            <span>STORE CONFIGURATION & CRAV IDENTITY</span>
            <span className="crav-sticker crav-sticker-red">
              NAVARRA FLAGSHIP
            </span>
          </div>
          <p className="page-hero-subtitle">
            Manage flagship store details, flat-top tax rates, currency symbol, color theme, and browser local storage state.
          </p>
        </div>
      </div>

      {/* Theme Preference */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title-group">
            <div className="panel-title">Interface Branding & Color Mood</div>
            <div className="panel-subtitle">Select between authentic Toasted Brioche Light (Framer style) or Charred Flat-Top Dark</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {/* Light Theme matching crav-burger.framer.website */}
          <div
            onClick={theme !== 'light' ? toggleTheme : undefined}
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: `3px solid ${theme === 'light' ? 'var(--crav-red)' : 'var(--border-subtle)'}`,
              backgroundColor: '#f5e3cd',
              color: '#1e130a',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: theme === 'light' ? 'var(--shadow-flame)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem' }}>
                <Sun size={20} style={{ color: '#de3618' }} />
                <span>Toasted Brioche & Butter</span>
              </div>
              {theme === 'light' && <Check size={20} style={{ color: '#de3618', strokeWidth: 3 }} />}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#574130', fontWeight: 600 }}>
              The exact signature creamy apricot & terracotta aesthetic from <strong>crav-burger.framer.website</strong>.
            </div>
          </div>

          {/* Dark Theme */}
          <div
            onClick={theme !== 'dark' ? toggleTheme : undefined}
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: `3px solid ${theme === 'dark' ? 'var(--crav-red)' : 'var(--border-subtle)'}`,
              backgroundColor: '#120c08',
              color: '#faede1',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: theme === 'dark' ? 'var(--shadow-flame)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem' }}>
                <Moon size={20} style={{ color: '#ff451a' }} />
                <span>Charred Flat-Top Griddle</span>
              </div>
              {theme === 'dark' && <Check size={20} style={{ color: '#ff451a', strokeWidth: 3 }} />}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#c9b4a1', fontWeight: 500 }}>
              Smoked espresso griddle dark theme with glowing neon chili embers and melted cheddar highlights.
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Store Configuration Form */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title-group">
            <div className="panel-title">
              <Building size={20} style={{ color: 'var(--crav-red)' }} />
              CRAV Flagship Store Details
            </div>
            <div className="panel-subtitle">Official branch location, contact, and receipt tax settings</div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Establishment Name</label>
              <input
                type="text"
                className="form-input"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address (Navarra)</label>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Phone Support</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currency Symbol</label>
              <select
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="$ (USD)">$ (USD)</option>
                <option value="€ (EUR)">€ (EUR)</option>
                <option value="£ (GBP)">£ (GBP)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">IVA / Sales Tax (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save CRAV Store Profile
            </button>
          </div>
        </form>
      </div>

      {/* Local Storage & Data Management */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title-group">
            <div className="panel-title">
              <ShieldCheck size={20} style={{ color: 'var(--crav-pickle-green)' }} />
              State Storage & Live Demo Management
            </div>
            <div className="panel-subtitle">
              All menu recipes, prices, and placed smash burger orders persist in browser storage.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExportBackup}>
            <Download size={16} /> Export CRAV JSON Backup
          </button>

          <button className="btn btn-danger" onClick={resetToDefaultData}>
            <RotateCcw size={16} /> Reset to Sample CRAV Data
          </button>
        </div>
      </div>
    </div>
  );
};
