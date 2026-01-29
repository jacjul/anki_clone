export default function AnkiIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle background */}
      <circle cx="50" cy="50" r="48" fill="#2196F3" />
      
      {/* Star shape */}
      <path
        d="M50 15 L58 40 L85 40 L63 55 L72 80 L50 65 L28 80 L37 55 L15 40 L42 40 Z"
        fill="#FFC107"
        stroke="#FFF"
        strokeWidth="2"
      />
      
      {/* Center circle */}
      <circle cx="50" cy="50" r="12" fill="#E91E63" stroke="#FFF" strokeWidth="2" />
    </svg>
  );
}
