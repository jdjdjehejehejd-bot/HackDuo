import { useEffect, useRef, useState } from "react";

type ExpandableTextProps = {
  /** 전체 설명 문장. '더보기'를 누르면 이 문장이 모두 보여요. */
  text: string;
  /**
   * 접힌 상태에서 먼저 보여줄 도입 문장.
   * 지정하면 접힌 상태에서는 이 문장만, 펼치면 전체 text가 보여요.
   */
  preview?: string;
  /** 접힌 상태에서 보여줄 최대 줄 수 (기본 2줄) */
  lines?: number;
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
};

/**
 * 긴 설명을 기본 상태에서는 짧게 보여주고,
 * '더보기'를 눌렀을 때만 전체 문장을 펼쳐 주는 공통 컴포넌트.
 */
export default function ExpandableText({
  text,
  preview,
  lines = 2,
  className,
  moreLabel = "더보기",
  lessLabel = "접기",
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  const collapsedText = preview && preview.length < text.length ? preview : text;
  const hasHiddenText = collapsedText !== text;

  useEffect(() => {
    setExpanded(false);
    setOverflowing(false);
  }, [text, preview]);

  useEffect(() => {
    const node = paragraphRef.current;
    if (!node) return;

    const measure = () => {
      if (expanded) return;
      setOverflowing(node.scrollHeight - node.clientHeight > 2);
    };

    measure();
    const frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [text, preview, lines, expanded]);

  const canExpand = hasHiddenText || overflowing;

  return (
    <div className={`expandable-text${expanded ? " is-expanded" : ""}${className ? ` ${className}` : ""}`}>
      <p
        ref={paragraphRef}
        style={{ WebkitLineClamp: expanded ? "unset" : String(lines) }}
      >
        {expanded ? text : collapsedText}
      </p>
      {canExpand && (
        <button
          type="button"
          className="description-toggle"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}
