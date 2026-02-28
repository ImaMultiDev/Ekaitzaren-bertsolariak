export type WorkType = "SONG" | "BOOK" | "POEM" | "OTHER";

export interface Work {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  content?: string;
  type: WorkType;
  featured: boolean;
  order: number;
  soundcloudId?: string;
  soundcloudUrl?: string;
  pdfUrl?: string;
  embedUrl?: string;
  images?: { url: string; alt?: string; caption?: string }[];
  tags?: string[];
}
