// Endpoints de artículos del blog (tabla `posts`): el front solo lee
// (GET /posts). El CRUD completo vive en el panel
// (panel-cruzcontroltours).
//
// Nota: `content` es el HTML generado por el editor del panel y debe
// sanearse con `sanitizePostHtml` de `@/lib/blog` antes de mostrarse.

import { apiFetch } from "./client";

export type ApiPost = {
  id: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  coverImage: string | null;
  content: string | null;
  published: boolean;
  createdAt: string;
};

export function listPosts(): Promise<ApiPost[]> {
  return apiFetch<ApiPost[]>("/posts");
}

export function getPost(id: string): Promise<ApiPost> {
  return apiFetch<ApiPost>(`/posts/${id}`);
}
