import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export const SalesChart = () => {
  const { salesChartData } = useRestaurant();
  const [timeframe, setTimeframe] = useState('week'); // 'today' | 'week' | 'month' | 'year'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = salesChartData[timeframe] || salesChartData.week;

  const totalPeriodSales = data.reduce((acc, curr) => acc + curr.sales, 0);
  const totalPeriodExpenses = data.reduce((acc, curr) => acc + curr.expenses, 0);
  const totalPeriodOrders = data.reduce((acc, curr) => acc + curr.orders, 0);

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map(d => Math.max(d.sales, d.expenses))) * 1.15 || 100;

  const getCoordinates = (val, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
    return { x, y };
  };

  // Generate sales curve points
  const salesPoints = data.map((d, i) => getCoordinates(d.sales, i));
  const expensePoints = data.map((d, i) => getCoordinates(d.expenses, i));

  // Build SVG path strings
  const salesPathString = salesPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const expensePathString = expensePoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const salesAreaString = `${salesPathString} L ${salesPoints[salesPoints.length - 1].x},${paddingTop + chartHeight} L ${salesPoints[0].x},${paddingTop + chartHeight} Z`;

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <BarChart3 size={20} style={{ color: 'var(--accent-amber)' }} />
            Revenue & Financial Trajectory
          </div>
          <div className="panel-subtitle">
            Gross sales vs. culinary food costs & overhead
          </div>
        </div>

        <div className="chart-timeframe-picker">
          {['today', 'week', 'month', 'year'].map(t => (
            <button
              key={t}
              className={`timeframe-btn ${timeframe === t ? 'active' : ''}`}
              onClick={() => {
                setTimeframe(t);
                setHoveredIndex(null);
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Total Period Sales</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            ${totalPeriodSales.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Total Expenses</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            ${totalPeriodExpenses.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Period Volume</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {totalPeriodOrders.toLocaleString()} Orders
          </div>
        </div>
      </div>

      <div className="chart-svg-container">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * ratio;
            const valueLabel = Math.round(maxVal * (1 - ratio));
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="var(--text-tertiary)"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="inherit"
                >
                  ${valueLabel >= 1000 ? `${(valueLabel / 1000).toFixed(0)}k` : valueLabel}
                </text>
              </g>
            );
          })}

          {/* Area fill for sales */}
          <path d={salesAreaString} fill="url(#salesGradient)" />

          {/* Lines */}
          <path
            d={expensePathString}
            fill="none"
            stroke="var(--accent-rose)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          <path
            d={salesPathString}
            fill="none"
            stroke="var(--accent-amber)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Interactive vertical hover indicator and points */}
          {salesPoints.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                {/* Invisible hover capture area */}
                <rect
                  x={pt.x - chartWidth / (data.length * 2)}
                  y={paddingTop}
                  width={chartWidth / data.length}
                  height={chartHeight}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                />

                {/* X Axis labels */}
                <text
                  x={pt.x}
                  y={svgHeight - 10}
                  fill={isHovered ? 'var(--text-primary)' : 'var(--text-tertiary)'}
                  fontSize="11"
                  fontWeight={isHovered ? '700' : '500'}
                  textAnchor="middle"
                  fontFamily="inherit"
                >
                  {data[i].label}
                </text>

                {/* Data point dot on sales */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="var(--accent-amber)"
                  strokeWidth="2.5"
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Hover line */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={paddingTop + chartHeight}
                    stroke="var(--accent-amber)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="animate-scale-up"
            style={{
              position: 'absolute',
              top: '10px',
              left: `${Math.min(
                Math.max(15, (salesPoints[hoveredIndex].x / svgWidth) * 100),
                80
              )}%`,
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 0.85rem',
              boxShadow: 'var(--shadow-md)',
              pointerEvents: 'none',
              zIndex: 10,
              fontSize: '0.75rem',
              minWidth: '140px'
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {data[hoveredIndex].label}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', color: 'var(--accent-amber)' }}>
              <span>Sales:</span>
              <span style={{ fontWeight: 700 }}>${data[hoveredIndex].sales.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', color: 'var(--accent-rose)' }}>
              <span>Expenses:</span>
              <span style={{ fontWeight: 700 }}>${data[hoveredIndex].expenses.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Orders:</span>
              <span style={{ fontWeight: 700 }}>{data[hoveredIndex].orders}</span>
            </div>
          </div>
        )}
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color-dot" style={{ backgroundColor: 'var(--accent-amber)' }} />
          <span>Total Sales Revenue</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-dot" style={{ backgroundColor: 'var(--accent-rose)' }} />
          <span>Kitchen Supplies & Operational Cost</span>
        </div>
        <div className="legend-item" style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          * Hover over points for exact stats
        </div>
      </div>
    </div>
  );
};
