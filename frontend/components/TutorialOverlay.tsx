import React, { useEffect, useState, useRef } from 'react';
import { TutorialStep } from '../types';
import { getTutorialStepByIndex, getTutorialLength } from '../data/tutorialSteps';

interface TutorialOverlayProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isActive: boolean;
}

interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  currentStep,
  onNext,
  onBack,
  onSkip,
  onComplete,
  isActive
}) => {
  const [targetPosition, setTargetPosition] = useState<ElementPosition | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentTutorialStep = getTutorialStepByIndex(currentStep);
  const totalSteps = getTutorialLength();

  useEffect(() => {
    if (!isActive || !currentTutorialStep) return;

    const updatePositions = () => {
      if (currentTutorialStep.target) {
        const targetElement = document.querySelector(currentTutorialStep.target) as HTMLElement;
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const position: ElementPosition = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          };
          setTargetPosition(position);
          calculateTooltipPosition(position, currentTutorialStep.position || 'bottom');
        } else {
          setTargetPosition(null);
          // Center tooltip when no target element found (mobile-friendly)
          const isMobile = window.innerWidth <= 480;
          if (isMobile) {
            setTooltipPosition({ 
              top: window.innerHeight / 2 - 100, 
              left: 8 
            });
          } else {
            setTooltipPosition({ 
              top: window.innerHeight / 2 - 100, 
              left: window.innerWidth / 2 - 200 
            });
          }
        }
      } else {
        setTargetPosition(null);
        // Center tooltip when no target (mobile-friendly)
        const isMobile = window.innerWidth <= 480;
        if (isMobile) {
          setTooltipPosition({ 
            top: window.innerHeight / 2 - 100, 
            left: 8 
          });
        } else {
          setTooltipPosition({ 
            top: window.innerHeight / 2 - 100, 
            left: window.innerWidth / 2 - 200 
          });
        }
      }
    };

    const calculateTooltipPosition = (targetPos: ElementPosition, position: string) => {
      const tooltipElement = tooltipRef.current;
      if (!tooltipElement) return;

      const tooltipRect = tooltipElement.getBoundingClientRect();
      const isMobile = window.innerWidth <= 480;
      const margin = isMobile ? 8 : 20;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let top = 0;
      let left = 0;

      // For mobile, always position at bottom with simpler logic
      if (isMobile) {
        // Position tooltip at bottom of screen on mobile
        top = viewportHeight - tooltipRect.height - margin - 60; // Extra space for mobile UI
        left = margin;
        setTooltipPosition({ top, left });
        return;
      }

      // Desktop positioning logic
      switch (position) {
        case 'top':
          top = targetPos.top - tooltipRect.height - margin;
          left = targetPos.left + (targetPos.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = targetPos.top + targetPos.height + margin;
          left = targetPos.left + (targetPos.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = targetPos.top + (targetPos.height / 2) - (tooltipRect.height / 2);
          left = targetPos.left - tooltipRect.width - margin;
          break;
        case 'right':
          top = targetPos.top + (targetPos.height / 2) - (tooltipRect.height / 2);
          left = targetPos.left + targetPos.width + margin;
          break;
        case 'center':
        default:
          top = viewportHeight / 2 - tooltipRect.height / 2;
          left = viewportWidth / 2 - tooltipRect.width / 2;
          break;
      }

      // Ensure tooltip stays within viewport (desktop only)
      if (left < margin) left = margin;
      if (left + tooltipRect.width > viewportWidth - margin) {
        left = viewportWidth - tooltipRect.width - margin;
      }
      if (top < margin) top = margin;
      if (top + tooltipRect.height > viewportHeight - margin) {
        top = viewportHeight - tooltipRect.height - margin;
      }

      setTooltipPosition({ top, left });
    };

    // Initial position calculation
    setTimeout(updatePositions, 100);

    // Recalculate on window resize
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, [currentStep, isActive, currentTutorialStep]);

  useEffect(() => {
    if (!isActive || !currentTutorialStep) return;

    // Apply visual effects to target element
    if (currentTutorialStep.target) {
      const targetElement = document.querySelector(currentTutorialStep.target) as HTMLElement;
      if (targetElement) {
        // Remove existing tutorial classes
        targetElement.classList.remove('tutorial-highlight', 'tutorial-pulse');
        
        // Add appropriate class based on action
        if (currentTutorialStep.action === 'highlight') {
          targetElement.classList.add('tutorial-highlight');
        } else if (currentTutorialStep.action === 'pulse') {
          targetElement.classList.add('tutorial-pulse');
        }

        // Block interactions if specified
        if (currentTutorialStep.action === 'block') {
          targetElement.style.pointerEvents = 'none';
        }
      }
    }

    // Cleanup function
    return () => {
      if (currentTutorialStep.target) {
        const targetElement = document.querySelector(currentTutorialStep.target) as HTMLElement;
        if (targetElement) {
          targetElement.classList.remove('tutorial-highlight', 'tutorial-pulse');
          targetElement.style.pointerEvents = '';
        }
      }
    };
  }, [currentStep, isActive, currentTutorialStep]);

  const handleNext = () => {
    if (currentStep >= totalSteps - 1) {
      onComplete();
    } else {
      onNext();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && currentTutorialStep?.nextTrigger === 'click') {
      handleNext();
    }
  };

  if (!isActive || !currentTutorialStep) return null;

  return (
    <>
      {/* Tutorial Styles */}
      <style>{`
        .tutorial-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          pointer-events: auto;
          overflow: hidden;
        }

        @media (max-width: 480px) {
          .tutorial-overlay {
            background: rgba(0, 0, 0, 0.6);
          }
        }

        .tutorial-highlight-box {
          position: absolute;
          border: 3px solid #4CAF50;
          border-radius: 8px;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px #4CAF50;
          background: transparent;
          pointer-events: none;
          z-index: 10001;
          animation: tutorial-glow 2s ease-in-out infinite;
        }

        @media (max-width: 480px) {
          .tutorial-highlight-box {
            border-width: 2px;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 15px #4CAF50;
          }
        }

        .tutorial-tooltip {
          position: fixed;
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          max-width: calc(100vw - 2rem);
          min-width: 280px;
          width: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 10002;
          font-family: 'Inter', sans-serif;
          transform-origin: center;
        }

        @media (max-width: 480px) {
          .tutorial-tooltip {
            min-width: calc(100vw - 2rem);
            max-width: calc(100vw - 1rem);
            left: 0.5rem !important;
            right: 0.5rem;
            width: calc(100vw - 1rem);
            margin: 0;
          }
        }

        @media (min-width: 481px) {
          .tutorial-tooltip {
            min-width: 300px;
            max-width: 400px;
            padding: 20px;
          }
        }

        .tutorial-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .tutorial-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .tutorial-progress {
          font-size: 12px;
          color: #666;
          background: #f0f0f0;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .tutorial-message {
          color: #333;
          line-height: 1.5;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .tutorial-lesson {
          background: #f8f9ff;
          border-left: 4px solid #4CAF50;
          padding: 12px;
          margin: 12px 0;
          border-radius: 0 6px 6px 0;
          font-size: 13px;
          color: #444;
          font-style: italic;
        }

        .tutorial-lesson::before {
          content: "💡 Music Business Insight: ";
          font-weight: 600;
          color: #4CAF50;
        }

        .tutorial-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          gap: 8px;
        }

        .tutorial-button {
          padding: 12px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          min-height: 44px;
          min-width: 80px;
          flex: 1;
        }

        @media (max-width: 480px) {
          .tutorial-button {
            font-size: 13px;
            padding: 10px 12px;
          }
        }

        .tutorial-button.primary {
          background: #4CAF50;
          color: white;
        }

        .tutorial-button.primary:hover {
          background: #45a049;
        }

        .tutorial-button.secondary {
          background: #f5f5f5;
          color: #666;
        }

        .tutorial-button.secondary:hover {
          background: #e0e0e0;
        }

        @keyframes tutorial-glow {
          0%, 100% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px #4CAF50; }
          50% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 30px #4CAF50, 0 0 40px #4CAF50; }
        }

        .tutorial-highlight {
          animation: tutorial-element-highlight 2s ease-in-out infinite;
          position: relative;
          z-index: 10001;
        }

        .tutorial-pulse {
          animation: tutorial-element-pulse 1.5s ease-in-out infinite;
          position: relative;
          z-index: 10001;
        }

        @keyframes tutorial-element-highlight {
          0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0.3); }
        }

        @keyframes tutorial-element-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* Main Overlay */}
      <div 
        className="tutorial-overlay" 
        ref={overlayRef}
        onClick={handleBackdropClick}
      >
        {/* Highlight Box */}
        {targetPosition && (
          <div
            className="tutorial-highlight-box"
            style={{
              top: targetPosition.top - 8,
              left: targetPosition.left - 8,
              width: targetPosition.width + 16,
              height: targetPosition.height + 16,
            }}
          />
        )}

        {/* Tooltip */}
        <div
          ref={tooltipRef}
          className="tutorial-tooltip"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <div className="tutorial-header">
            <h3 className="tutorial-title">{currentTutorialStep.title}</h3>
            <span className="tutorial-progress">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>

          <div className="tutorial-message">
            {currentTutorialStep.message}
          </div>

          {currentTutorialStep.musicBusinessLesson && (
            <div className="tutorial-lesson">
              {currentTutorialStep.musicBusinessLesson}
            </div>
          )}

          <div className="tutorial-controls">
            {currentStep > 0 && (
              <button
                className="tutorial-button secondary"
                onClick={onBack}
              >
                ← Back
              </button>
            )}
            <button
              className="tutorial-button secondary"
              onClick={onSkip}
              style={{ flex: currentStep > 0 ? '0.8' : '1' }}
            >
              Skip
            </button>
            <button
              className="tutorial-button primary"
              onClick={handleNext}
            >
              {currentStep >= totalSteps - 1 ? 'Complete!' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};