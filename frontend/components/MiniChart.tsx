import React from 'react';

interface MiniChartProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  showPositiveNegative?: boolean;
}

export const MiniChart: React.FC<MiniChartProps> = ({ 
  data, 
  color, 
  width = 200, 
  height = 60, 
  showPositiveNegative = false 
}) => {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center text-gray-400 text-sm" style={{ width, height }}>
        Not enough data
      </div>
    );
  }

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;
  
  // If all values are the same, create a small range to avoid division by zero
  const effectiveRange = range === 0 ? 1 : range;
  
  // Calculate zero line position if showing positive/negative
  const zeroLineY = showPositiveNegative && minValue < 0 
    ? height - ((0 - minValue) / effectiveRange) * height 
    : null;

  // Generate path points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / effectiveRange) * height;
    return { x, y, value };
  });

  // Create SVG path
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  // Determine line color based on position relative to zero line
  const getLineColor = () => {
    if (!showPositiveNegative) return color;
    
    const latestValue = data[data.length - 1];
    return latestValue >= 0 ? '#10b981' : '#ef4444'; // green-500 : red-500
  };

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Zero line if showing positive/negative */}
        {showPositiveNegative && zeroLineY !== null && (
          <line
            x1={0}
            y1={zeroLineY}
            x2={width}
            y2={zeroLineY}
            stroke="#6b7280"
            strokeWidth={1}
            strokeDasharray="2,2"
            opacity={0.5}
          />
        )}
        
        {/* Chart line */}
        <path
          d={pathData}
          fill="none"
          stroke={getLineColor()}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={2}
            fill={getLineColor()}
            className="opacity-70"
          />
        ))}
        
        {/* Highlight latest point */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={3}
            fill={getLineColor()}
            stroke="white"
            strokeWidth={1}
          />
        )}
      </svg>
      
      {/* Value labels */}
      <div className="absolute top-0 left-0 text-xs text-gray-400 font-medium">
        ${Math.max(...data).toLocaleString()}
      </div>
      <div className="absolute bottom-0 left-0 text-xs text-gray-400 font-medium">
        ${Math.min(...data).toLocaleString()}
      </div>
      <div className="absolute bottom-0 right-0 text-xs font-medium" style={{ color: getLineColor() }}>
        ${data[data.length - 1].toLocaleString()}
      </div>
    </div>
  );
};