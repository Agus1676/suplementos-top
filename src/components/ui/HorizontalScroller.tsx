import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollerProps {
  children: React.ReactNode;
  /** Accessible label for the scroll region */
  ariaLabel: string;
  /** Visible items per breakpoint (mobile / tablet / desktop) */
  perView?: { mobile: number; tablet: number; desktop: number };
  /** Gap between items, in rem */
  gapRem?: number;
  /** Peek of the next item on mobile so users know they can swipe (0-1 of an item) */
  mobilePeek?: number;
}

/**
 * Native, dependency-free horizontal carousel.
 * - CSS scroll-snap → 60fps swipe on mobile, no JS on scroll path.
 * - Arrow buttons on desktop that scroll exactly one "page".
 * - Arrows auto-disable at both ends.
 */
export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  children,
  ariaLabel,
  perView = { mobile: 2, tablet: 3, desktop: 4 },
  gapRem = 0.75,
  mobilePeek = 0.25,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  const style = {
    '--hs-gap': `${gapRem}rem`,
    '--hs-mobile': perView.mobile + mobilePeek,
    '--hs-tablet': perView.tablet,
    '--hs-desktop': perView.desktop,
  } as React.CSSProperties;

  return (
    <div className="hs-root" style={style}>
      <button
        type="button"
        className="hs-arrow hs-arrow-prev"
        onClick={() => scrollByPage(-1)}
        disabled={!canPrev}
        aria-label="Ver anteriores"
      >
        <ChevronLeft size={20} />
      </button>

      <div ref={trackRef} className="hs-track" role="region" aria-label={ariaLabel} tabIndex={0}>
        {React.Children.map(children, (child) => (
          <div className="hs-item">{child}</div>
        ))}
      </div>

      <button
        type="button"
        className="hs-arrow hs-arrow-next"
        onClick={() => scrollByPage(1)}
        disabled={!canNext}
        aria-label="Ver siguientes"
      >
        <ChevronRight size={20} />
      </button>

      <style>{`
        .hs-root {
          position: relative;
        }
        .hs-track {
          display: flex;
          gap: var(--hs-gap);
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 0.25rem 0.1rem 0.5rem;
          outline: none;
        }
        .hs-track::-webkit-scrollbar {
          display: none;
        }
        .hs-item {
          flex: 0 0 calc((100% - (var(--hs-gap) * (var(--hs-mobile) - 1))) / var(--hs-mobile));
          scroll-snap-align: start;
          min-width: 0;
          display: flex;
        }
        .hs-item > * {
          width: 100%;
        }
        @media (min-width: 768px) {
          .hs-item {
            flex-basis: calc((100% - (var(--hs-gap) * (var(--hs-tablet) - 1))) / var(--hs-tablet));
          }
        }
        @media (min-width: 1100px) {
          .hs-item {
            flex-basis: calc((100% - (var(--hs-gap) * (var(--hs-desktop) - 1))) / var(--hs-desktop));
          }
        }
        .hs-arrow {
          display: none;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 5;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFFFFF;
          color: var(--color-text-main);
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
        }
        .hs-arrow:hover:not(:disabled) {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: #FFFFFF;
        }
        .hs-arrow:disabled {
          opacity: 0;
          pointer-events: none;
        }
        .hs-arrow-prev { left: -18px; }
        .hs-arrow-next { right: -18px; }
        @media (min-width: 900px) {
          .hs-arrow { display: flex; }
        }
      `}</style>
    </div>
  );
};
