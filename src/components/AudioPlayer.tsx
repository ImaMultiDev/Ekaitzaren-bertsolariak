"use client";

interface AudioPlayerProps {
  /** ID/nombre del archivo en Cloudflare R2 (ej: audios/cancion.mp3) */
  cloudflareId: string;
}

export default function AudioPlayer({ cloudflareId }: AudioPlayerProps) {
  const baseUrl = process.env.NEXT_PUBLIC_R2_AUDIO_URL?.replace(/\/$/, "") ?? "";
  const src = baseUrl && cloudflareId ? `${baseUrl}/${cloudflareId}` : "";

  if (!src) {
    return (
      <div className="border border-border p-12 text-center">
        <p className="text-grey-muted text-sm">Reproductor de audio</p>
        <p className="text-grey-muted/80 text-xs mt-2">
          Configura NEXT_PUBLIC_R2_AUDIO_URL y el ID de Cloudflare para el audio
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border p-4">
      <audio
        controls
        preload="metadata"
        className="w-full max-w-md"
        src={src}
      >
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  );
}
