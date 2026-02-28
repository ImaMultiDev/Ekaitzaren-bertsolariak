"use client";

interface SoundCloudEmbedProps {
  trackId: string;
  color?: string;
}

export default function SoundCloudEmbed({
  trackId,
  color = "b91c1c",
}: SoundCloudEmbedProps) {
  // Placeholder para desarrollo cuando no hay ID real
  if (!trackId || trackId === "example") {
    return (
      <div className="rounded border border-border p-12 text-center bg-black/50">
        <p className="text-stone text-sm">Reproductor SoundCloud</p>
        <p className="text-stone/70 text-xs mt-2">
          Añade el ID de tu pista en SoundCloud para incrustar el audio
        </p>
      </div>
    );
  }

  const embedUrl = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23${color}&auto_play=false&hide_related=false&show_comments=true`;

  return (
    <div className="rounded overflow-hidden border border-border">
      <iframe
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={embedUrl}
        title="Reproductor SoundCloud"
        className="w-full"
      />
    </div>
  );
}
