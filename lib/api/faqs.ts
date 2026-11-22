import { apiFetch } from "./client";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  active: boolean;
};

export function listFaqs(): Promise<Faq[]> {
  return apiFetch<Faq[]>("/faqs");
}
