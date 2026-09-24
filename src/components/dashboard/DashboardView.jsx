import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { StatCard } from './StatCard';
import { SalesChart } from './SalesChart';
import { TopItemsWidget } from './TopItemsWidget';
import { RecentOrders } from './RecentOrders';
import {
  DollarSign,
  ShoppingBag,
  TrendingDown,
  PieChart,
  Clock,
  Flame,
  ChefHat,
  Sparkles,
  MapPin
} from 'lucide-react';

export const DashboardView = ({ onSelectOrder, onOpenNewOrder }) => {
  const {
    totalSales,
    totalOrdersCount,
    totalExpenses,
    netProfit,
    profitMargin,
    activeOrdersCount,
    orders
  } = useRestaurant();

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const preparingCount = orders.filter(o => o.status === 'Preparing').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="page-container">
      {/* CRAV Dedicated Hero Banner */}
      <div className="page-hero-banner">
        <div>
          <div className="breadcrumbs">
            <span>CRAV OS</span> / <span>Operations</span> / <strong>Live Shift Command</strong>
          </div>
          <div className="page-hero-title">
            <span>READY TO CRAV!</span>
            <span className="crav-sticker crav-sticker-red">
              <Flame size={12} fill="currentColor" /> Flat-Top Active
            </span>
          </div>
          <p className="page-hero-subtitle">
            Smashed hot on the flat top, locking in signature flavor under a caramelized crust. Real-time ticket pacing and shift revenues.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            <Clock size={15} style={{ color: 'var(--crav-red)' }} />
            <span>Shift: <strong>Lunch & Dinner Rush</strong></span>
          </div>

          <button className="btn btn-primary" onClick={onOpenNewOrder}>
            <Flame size={15} fill="currentColor" /> Smashed Order
          </button>
        </div>
      </div>

      {/* 4 Core Financial & Volume KPI Cards */}
      <div className="kpi-grid">
        <StatCard
          title="Gross Smashed Revenue"
          value={`$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="vs. $21,750 last week"
          trendPercent="+16.4%"
          isPositive={true}
          icon={DollarSign}
          colorScheme="rose"
          sparklineData={[42, 48, 55, 62, 68, 76, 84, 91, 98]}
        />

        <StatCard
          title="Total Burgers Served"
          value={totalOrdersCount.toLocaleString()}
          subtext={`${activeOrdersCount} sizzle on flat-top right now`}
          trendPercent="+9.2%"
          isPositive={true}
          icon={ShoppingBag}
          colorScheme="indigo"
          sparklineData={[32, 38, 45, 42, 50, 58, 66, 72, 80]}
        />

        <StatCard
          title="Meat, Cheese & Buns Cost"
          value={`$${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Wagyu grind, brioche & cheddar"
          trendPercent="-3.1%"
          isPositive={true}
          icon={TrendingDown}
          colorScheme="amber"
          sparklineData={[72, 69, 66, 63, 60, 62, 59, 56, 52]}
        />

        <StatCard
          title="Net Flat-Top Profit"
          value={`$${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext={`Net margin: ${profitMargin}%`}
          trendPercent="+21.5%"
          isPositive={true}
          icon={PieChart}
          colorScheme="emerald"
          sparklineData={[36, 40, 46, 52, 60, 69, 78, 88, 97]}
        />
      </div>

      {/* Live Flat-Top Pacing Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-pending)',
              boxShadow: '0 0 8px var(--status-pending)'
            }}
          />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
              Incoming Tickets
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900 }}>
              {pendingCount} waiting
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--crav-red)',
              boxShadow: '0 0 8px var(--crav-red)'
            }}
          />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
              Hot on the Flat-Top
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--crav-red)' }}>
              {preparingCount} smashing
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-ready)',
              boxShadow: '0 0 8px var(--status-ready)'
            }}
          />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
              Plated & Bagged
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--status-ready)' }}>
              {readyCount} ready
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--crav-pickle-green)',
              boxShadow: '0 0 8px var(--crav-pickle-green)'
            }}
          />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>
              Billed & Dispatched
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--crav-pickle-green)' }}>
              {deliveredCount} completed
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Sales Trajectory & Bestselling Dishes */}
      <div className="dashboard-grid-2">
        <SalesChart />
        <TopItemsWidget />
      </div>

      {/* Bottom Section: Recent Orders Table */}
      <RecentOrders onSelectOrder={onSelectOrder} />
    </div>
  );
};
