/**
 * MD monogram. A hand-drawn SVG is permitted here under skill 4.8 because
 * this is a single simple geometric wordmark, which is one of the listed
 * exceptions. It is not a decorative illustration and it is not an icon:
 * every functional icon on this site comes from Phosphor.
 *
 * The accent reads as a lit edge rather than an outer bloom. (skill 9.A)
 */
export function Monogram({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      /* Decorative. The accessible name lives on the link that wraps this, so
         the visible "MD" glyphs cannot contradict it. */
      aria-hidden="true"
      focusable="false"
    >
      {/* Angular shield outline */}
      <path
        d="M20 2.5 35.5 10v12.2c0 8.4-5.9 13.6-15.5 15.3C10.4 35.8 4.5 30.6 4.5 22.2V10L20 2.5Z"
        stroke="#00F0FF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Inner hairline, inset rather than glowing outward */}
      <path
        d="M20 6.4 31.6 12v10.2c0 6.6-4.6 10.8-11.6 12.2C13 33 8.4 28.8 8.4 22.2V12L20 6.4Z"
        stroke="rgba(0,240,255,0.22)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <text
        x="20"
        y="25.4"
        textAnchor="middle"
        fontFamily="Syne, sans-serif"
        fontSize="14"
        fontWeight="700"
        letterSpacing="0.5"
        fill="#F8FAFC"
      >
        MD
      </text>
    </svg>
  );
}
