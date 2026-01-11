type CrownIconProps = {
  className?: string;
};

export default function CrownIcon({ className }: CrownIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="64" height="64" rx="32" fill="#FFD54F" />

      <path d="M10 44L16 18L32 30L48 18L54 44H10Z" fill="#FFA000" />
    </svg>
  );
}
