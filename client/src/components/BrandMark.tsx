import { ShieldCheck } from "lucide-react";

type BrandMarkProps = { compact?: boolean };

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className={`brand-lockup${compact ? " brand-lockup-compact" : ""}`}>
      <span className="brand-symbol" aria-hidden="true">
        <ShieldCheck size={22} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="brand-name">
          hack<span>duo</span>
        </span>
      )}
    </span>
  );
}
