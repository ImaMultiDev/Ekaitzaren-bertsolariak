"use client";

export default function GeometricOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Líneas horizontales */}
      <div className="absolute top-[15%] left-0 right-0 h-px bg-red/30" />
      <div className="absolute top-[25%] left-0 right-0 h-px bg-green/20" />
      <div className="absolute top-[35%] left-0 right-0 h-px bg-red/20" />
      <div className="absolute bottom-[30%] left-0 right-0 h-px bg-green/25" />
      <div className="absolute bottom-[15%] left-0 right-0 h-px bg-red/20" />

      {/* Líneas diagonales */}
      <div className="absolute top-0 left-[20%] w-px h-full bg-red/15 -rotate-12" />
      <div className="absolute top-0 left-[40%] w-px h-full bg-green/10 rotate-6" />
      <div className="absolute top-0 right-[25%] w-px h-full bg-red/15 rotate-[-8deg]" />
      <div className="absolute top-0 right-[10%] w-px h-full bg-green/10 rotate-12" />

      {/* Rectángulos/trapecios */}
      <div className="absolute top-[20%] right-[15%] w-24 h-24 border border-red/20 rotate-12" />
      <div className="absolute bottom-[25%] left-[10%] w-32 h-20 border border-green/20 -rotate-6" />
      <div className="absolute top-[60%] right-[30%] w-16 h-16 border border-red/15 rotate-45" />
    </div>
  );
}
