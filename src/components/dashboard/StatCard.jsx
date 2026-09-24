import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtext,
  trendPercent,
  isPositive = true,
  icon: Icon,
  colorScheme = 'amber',
  sparklineData = [35, 42, 38, 55, 60, 52, 70, 65, 82, 95]
}) => {
  // Generate a mini sparkline path from sparklineData
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 80;
  const height = 30;

  const points = sparklineData.map((d, i) => {
    const x = (i / (sparklineData.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor =
    colorScheme === 'amber'
      ? 'var(--accent-amber)'
      : colorScheme === 'emerald'
      ? 'var(--accent-emerald)'
      : colorScheme === 'rose'
      ? 'var(--accent-rose)'
      : 'var(--accent-indigo)';

  return (
    <div className={`kpi-card ${colorScheme}`}>
      <div className="kpi-card-header">
        <div className={`kpi-icon-bubble ${colorScheme}`}>
          <Icon size={22} />
        </div>
        <div className={`trend-badge ${isPositive ? 'up' : 'down'}`}>
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{trendPercent}</span>
        </div>
      </div>

      <div>
        <div className="kpi-title">{title}</div>
        <div className="kpi-value">{value}</div>
      </div>

      <div className="kpi-footer-note">
        <span>{subtext}</span>
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
};
