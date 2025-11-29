import React from 'react';

interface LoadingSkeletonProps {
  type?: 'save-card' | 'stat-card' | 'text' | 'button' | 'chart';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'text', count = 1, className = '' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const renderSkeleton = () => {
    switch (type) {
      case 'save-card':
        return (
          <div className={`bg-[#2D1115] border border-gray-700 rounded-lg p-4 animate-pulse ${className}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
              </div>
              <div className="h-8 w-20 bg-gray-700 rounded"></div>
            </div>
            <div className="flex gap-4 mt-3">
              <div className="h-3 bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        );
      
      case 'stat-card':
        return (
          <div className={`bg-[#2D1115] border border-gray-700 rounded-lg p-4 animate-pulse ${className}`}>
            <div className="h-4 bg-gray-700 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-700 rounded w-16"></div>
          </div>
        );
      
      case 'chart':
        return (
          <div className={`bg-[#2D1115] border border-gray-700 rounded-lg p-4 animate-pulse ${className}`}>
            <div className="h-4 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="flex items-end justify-between gap-2 h-32">
              {[40, 60, 80, 50, 70, 90].map((height, i) => (
                <div key={i} className="flex-1 bg-gray-700 rounded-t" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        );
      
      case 'button':
        return (
          <div className={`h-10 bg-gray-700 rounded-lg animate-pulse ${className}`}></div>
        );
      
      case 'text':
      default:
        return (
          <div className={`h-4 bg-gray-700 rounded animate-pulse ${className}`}></div>
        );
    }
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default LoadingSkeleton;
