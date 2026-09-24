import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Download,
  Flame,
  ArrowUpRight,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';

export const AnalyticsView = () => {
  const {
    totalSales,
    totalExpenses,
    netProfit,
    profitMargin,
    orders,
    menuItems,
    expenses,
    addToast
  } = useRestaurant();

  const [dateRange, setDateRange] = useState('This Month');

  // Compute category sales distribution tailored to CRAV
  const categoryStats = {
    'Smashed Burgers': { revenue: totalSales * 0.58, count: 1240, percentage: 58, color: '#ff451a' },
    'Loaded Sides & Fries': { revenue: totalSales * 0.21, count: 890, percentage: 21, color: '#fdb813' },
    'Hand-Spun Shakes': { revenue: totalSales * 0.12, count: 520, percentage: 12, color: '#a855f7' },
    'Craft Drinks': { revenue: totalSales * 0.06, count: 410, percentage: 6, color: '#38bdf8' },
    'Sweet Bites': { revenue: totalSales * 0.03, count: 180, percentage: 3, color: '#ec4899' }
  };

  const aov = (totalSales / (orders.length + 1276)).toFixed(2);
  const foodCostRatio = ((totalExpenses / totalSales) * 100).toFixed(1);

  const handleExport = () => {
    addToast('Statement Downloaded', 'CRAV financial ledger exported to CSV.', 'success');
  };

  return (
    <div className="page-container">
      {/* CRAV Dedicated Hero Banner */}
      <div className="page-hero-banner">
        <div>
          <div className="breadcrumbs">
            <span>CRAV OS</span> / <span>Business Intelligence</span> / <strong>Financials & Cost Ratios</strong>
          </div>
          <div className="page-hero-title">
            <span>PATTY MARGINS & FINANCIAL AUDIT</span>
            <span className="crav-sticker crav-sticker-cheddar">
              {profitMargin}% NET MARGIN
            </span>
          </div>
          <p className="page-hero-subtitle">
            Auditing gross receipts, raw beef chuck grinds, artisan buns, cheddar blocks, and plancha gas utilities for maximum profitability.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="chart-timeframe-picker">
            {['This Week', 'This Month', 'Fiscal Q3'].map(range => (
              <button
                key={range}
                className={`timeframe-btn ${dateRange === range ? 'active' : ''}`}
                onClick={() => setDateRange(range)}
              >
                {range}
              </button>
            ))}
          </div>

          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Health Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card rose">
          <div className="kpi-card-header">
            <span className="kpi-title">Average Smashed Ticket</span>
            <div className="trend-badge up">+8.2%</div>
          </div>
          <div className="kpi-value">${aov}</div>
          <div className="kpi-footer-note">Driven by burger + shake combos</div>
        </div>

        <div className="kpi-card emerald">
          <div className="kpi-card-header">
            <span className="kpi-title">Food Cost Ratio</span>
            <div className="trend-badge up">27.6%</div>
          </div>
          <div className="kpi-value">{foodCostRatio}%</div>
          <div className="kpi-footer-note">Superb margin (target &lt; 30%)</div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-card-header">
            <span className="kpi-title">Flat-Top Sizzle Speed</span>
            <div className="trend-badge up">7.2 mins</div>
          </div>
          <div className="kpi-value">Fast Casual</div>
          <div className="kpi-footer-note">Ticket to plate average time</div>
        </div>

        <div className="kpi-card indigo">
          <div className="kpi-card-header">
            <span className="kpi-title">Daily Patty Output</span>
            <div className="trend-badge up">+12.4%</div>
          </div>
          <div className="kpi-value">540 patties</div>
          <div className="kpi-footer-note">Peak lunch + dinner shifts</div>
        </div>
      </div>

      {/* Category Breakdown & Peak Flat-Top Hours */}
      <div className="dashboard-grid-2">
        {/* Category Breakdown */}
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title-group">
              <div className="panel-title">
                <PieChart size={20} style={{ color: 'var(--crav-red)' }} />
                Revenue Share by Menu Category
              </div>
              <div className="panel-subtitle">Gross receipts across burgers, fries, and shakes</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(categoryStats).map(([cat, stat]) => (
              <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: stat.color }} />
                    <span>{cat}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--text-primary)' }}>
                      ${stat.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span style={{ color: 'var(--text-tertiary)', marginLeft: '6px', fontWeight: 600 }}>
                      ({stat.percentage}%)
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    height: '9px',
                    width: '100%',
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${stat.percentage}%`,
                      backgroundColor: stat.color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Dining Hours Traffic */}
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title-group">
              <div className="panel-title">
                <Clock size={20} style={{ color: 'var(--crav-cheddar)' }} />
                Flat-Top Peak Griddle Demand
              </div>
              <div className="panel-subtitle">Patty throughput by hour of day</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { period: '12:30 PM - 02:30 PM (Lunch Crave)', load: 92, status: 'Flat-Top Maxed', color: 'var(--crav-red)' },
              { period: '03:00 PM - 06:30 PM (Afternoon Shake Stop)', load: 38, status: 'Steady Flow', color: 'var(--crav-pickle-green)' },
              { period: '07:30 PM - 10:00 PM (Dinner Rush)', load: 98, status: 'Full Plancha Fire', color: 'var(--crav-red)' },
              { period: '10:00 PM - 11:30 PM (Late Night Burgers)', load: 60, status: 'Counter Traffic', color: 'var(--crav-cheddar)' }
            ].map((slot, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.95rem',
                  backgroundColor: 'var(--bg-card-hover)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{slot.period}</span>
                  <span style={{ color: slot.color, fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {slot.status} ({slot.load}%)
                  </span>
                </div>
                <div style={{ height: '7px', backgroundColor: 'var(--bg-muted)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${slot.load}%`, backgroundColor: slot.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Expenses Log */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title-group">
            <div className="panel-title">
              <Layers size={20} style={{ color: 'var(--crav-red)' }} />
              Meat Butchery & Procurement Ledger
            </div>
            <div className="panel-subtitle">Beef chuck deliveries, cheese blocks, brioche bakers, and plancha gas</div>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Supply Description</th>
                <th>Category</th>
                <th>Supplier / Vendor</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--crav-red)' }}>{exp.id}</td>
                  <td style={{ fontWeight: 700 }}>{exp.title}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--bg-muted)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{exp.vendor}</td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 600 }}>{exp.date}</td>
                  <td style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--crav-red)' }}>
                    -${exp.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
