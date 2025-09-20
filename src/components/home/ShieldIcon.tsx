export default function ShieldIcon() {
  return (
    <span className="inline-flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        {/* Shield */}
        <path d="M12 2l7 3v6c0 5-3.5 9-7 11C8.5 20 5 16 5 11V5l7-3z" />

        {/* Tick centered */}
        <g transform="translate(12,12) scale(0.8)">
          <path
            d="M -3 0 L -1 2 L 3 -2"
            stroke="#fff"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </span>
  );
}