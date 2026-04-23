interface SegmentBarProps {
  filled: number;
  total: number;
  compact?: boolean;
}

export function SegmentBar({ filled, total, compact = false }: SegmentBarProps) {
  return (
    <div className={`segment-bar ${compact ? 'is-compact' : ''}`} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`segment ${index < filled ? 'is-filled' : ''}`}
        />
      ))}
    </div>
  );
}
