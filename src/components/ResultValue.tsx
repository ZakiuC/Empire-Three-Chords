import { useLayoutEffect, useRef } from 'react';

interface ResultValueProps {
  value: string;
  renderKey: number;
  className?: string;
  maxSize?: number;
  minSize?: number;
}

export function ResultValue({
  value,
  renderKey,
  className = '',
  maxSize = 70,
  minSize = 24,
}: ResultValueProps) {
  const valueRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const element = valueRef.current;
    if (!element) return;

    const fitText = () => {
      let nextSize = maxSize;
      element.style.fontSize = `${maxSize}px`;
      while (element.scrollWidth > element.clientWidth && nextSize > minSize) {
        nextSize -= 2;
        element.style.fontSize = `${nextSize}px`;
      }
    };

    const frame = window.requestAnimationFrame(fitText);
    window.addEventListener('resize', fitText);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', fitText);
    };
  }, [className, maxSize, minSize, renderKey, value]);

  return (
    <div className="result-value-slot">
      <div
        key={renderKey}
        ref={valueRef}
        className={`result-value animate-swap ${className}`.trim()}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}
