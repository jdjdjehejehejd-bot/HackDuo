type ShieldBuddyProps = {
  className?: string;
};

export default function ShieldBuddy({ className }: ShieldBuddyProps) {
  return (
    <svg className={className} viewBox="0 0 160 172" role="img" aria-label="TEUM 안전 학습 마스코트">
      <defs>
        <linearGradient id="buddy-shell" x1="22" y1="9" x2="140" y2="158" gradientUnits="userSpaceOnUse"><stop stopColor="#d36bea" /><stop offset="1" stopColor="#a947da" /></linearGradient>
        <linearGradient id="buddy-belly" x1="54" y1="82" x2="108" y2="142" gradientUnits="userSpaceOnUse"><stop stopColor="#fffaff" /><stop offset="1" stopColor="#f0dff8" /></linearGradient>
      </defs>
      <path d="M80 8 143 30v43c0 40-25 68-63 89C42 141 17 113 17 73V30L80 8Z" fill="url(#buddy-shell)" stroke="#8f38b8" strokeWidth="5" strokeLinejoin="round" />
      <path d="M80 26 126 42v31c0 31-18 53-46 71C52 126 34 104 34 73V42l46-16Z" fill="none" stroke="#f5d5ff" strokeWidth="3" strokeLinejoin="round" opacity=".75" />
      <path d="M48 84c0-16 11-28 32-28s32 12 32 28v29c0 14-13 24-32 24s-32-10-32-24V84Z" fill="url(#buddy-belly)" />
      <ellipse cx="67" cy="86" rx="5.8" ry="8" fill="#502661" /><ellipse cx="94" cy="86" rx="5.8" ry="8" fill="#502661" />
      <circle cx="69" cy="83" r="1.8" fill="#fff" /><circle cx="96" cy="83" r="1.8" fill="#fff" />
      <path d="M72 105c4 5 12 5 16 0" fill="none" stroke="#8d3fac" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="54" cy="101" rx="5" ry="3.4" fill="#ff9cbb" opacity=".72" /><ellipse cx="106" cy="101" rx="5" ry="3.4" fill="#ff9cbb" opacity=".72" />
      <path d="M31 68c-7 4-10 10-9 18" fill="none" stroke="#8f38b8" strokeWidth="5" strokeLinecap="round" /><path d="M129 68c7 4 10 10 9 18" fill="none" stroke="#8f38b8" strokeWidth="5" strokeLinecap="round" />
      <path d="m80 32 3.2 7.8 8.4.7-6.5 5.3 2 8.1-7.1-4.4-7.1 4.4 2-8.1-6.5-5.3 8.4-.7L80 32Z" fill="#ffda87" />
    </svg>
  );
}
