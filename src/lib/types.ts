export type WorkType = "SONG" | "BOOK";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  year?: number;
  order: number;
  worksCount?: number;
}

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
  project?: Project;
  soundcloudId?: string;
  soundcloudUrl?: string;
  pdfUrl?: string;
  embedUrl?: string;
  images?: { url: string; alt?: string; caption?: string }[];
  tags?: string[];
}
