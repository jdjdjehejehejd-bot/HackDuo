type BrandMarkProps = { compact?: boolean };

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className={`brand-lockup${compact ? " brand-lockup-compact" : ""}`}>
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 36 36" fill="none">
          <path d="M9 8h18v20H9z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M18 8v9h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="22.5" cy="22" r="1.5" fill="currentColor" />
        </svg>
      </span>
      {!compact && <span className="brand-name">TEUM<span className="brand-period">.</span></span>}
    </span>
  );
}
