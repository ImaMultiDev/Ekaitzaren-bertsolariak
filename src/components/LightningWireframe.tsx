"use client";

export default function LightningWireframe() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.08]"
      aria-hidden
    >
      <svg
        viewBox="0 0 400 600"
        className="absolute -bottom-20 -right-20 w-[80vw] max-w-[600px] h-[120vh] -rotate-[-15deg]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Lightning bolt wireframe */}
        <path
          d="M200 20 L120 280 L180 280 L100 580 L220 320 L160 320 L280 20 Z"
          className="text-red"
        />
      </svg>
    </div>
  );
}
