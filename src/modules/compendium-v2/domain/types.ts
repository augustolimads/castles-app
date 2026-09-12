export const COMPENDIUM_CATEGORIES = [
  "raça",
  "classe",
  "regras",
  "habilidades",
  "feitiços",
  "itens",
  "monstros",
] as const;

export type CompendiumCategory = (typeof COMPENDIUM_CATEGORIES)[number];

export interface CompendiumDataV1 {
  version: 1;
  format: "markdown";
  content: string;
  template?: string;
}

export type CompendiumData = CompendiumDataV1 | Record<string, unknown>;

export interface CompendiumEntry {
  id: string;
  nome: string;
  thumbnail: string | null;
  data: CompendiumData;
  category: CompendiumCategory;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CompendiumListItem {
  id: string;
  nome: string;
  thumbnail: string | null;
  category: CompendiumCategory;
  tags: string[];
  updated_at: string;
}

export interface CompendiumListResponse {
  items: CompendiumListItem[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface CompendiumUpsertInput {
  nome: string;
  thumbnail?: string | null;
  data: CompendiumData;
  category: CompendiumCategory;
  tags?: string[];
}

export function isCompendiumCategory(
  value: string,
): value is CompendiumCategory {
  return COMPENDIUM_CATEGORIES.includes(value as CompendiumCategory);
}

export function parseTagsInput(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, list) => list.indexOf(tag) === index);
}

export function normalizeTags(tags?: string[] | null): string[] {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => `${tag}`.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, list) => list.indexOf(tag) === index);
}

export function getMarkdownContent(data: CompendiumData): string {
  if (
    data &&
    typeof data === "object" &&
    "format" in data &&
    "content" in data &&
    (data as { format?: string }).format === "markdown" &&
    typeof (data as { content?: unknown }).content === "string"
  ) {
    return (data as { content: string }).content;
  }

  return JSON.stringify(data, null, 2);
}
