import type { Database } from "@/lib/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
    type CompendiumEntry,
    type CompendiumListResponse,
    type CompendiumUpsertInput,
    normalizeTags,
} from "../domain/types";

interface ListQuery {
  page: number;
  perPage: number;
  search?: string;
  category?: string;
  tags?: string[];
}

type DBCompendiumRow =
  Database["public"]["Tables"]["compendium_v2_entries"]["Row"];

type DBCompendiumInsert =
  Database["public"]["Tables"]["compendium_v2_entries"]["Insert"];

type DBCompendiumUpdate =
  Database["public"]["Tables"]["compendium_v2_entries"]["Update"];

function coerceCompendiumData(
    value: DBCompendiumRow["data"],
): CompendiumEntry["data"] {
    if (value && typeof value === "object") {
        return value as CompendiumEntry["data"];
    }

    return {
        version: 1,
        format: "markdown",
        content: value == null ? "" : String(value),
    };
}

function mapRow(row: DBCompendiumRow): CompendiumEntry {
  return {
    id: row.id,
    nome: row.nome,
    thumbnail: row.thumbnail,
      data: coerceCompendiumData(row.data),
    category: row.category as CompendiumEntry["category"],
    tags: normalizeTags(row.tags),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listCompendiumEntries(
  supabase: SupabaseClient<Database>,
  userId: string,
  query: ListQuery,
): Promise<CompendiumListResponse> {
  const page = Math.max(1, query.page);
  const perPage = Math.min(Math.max(1, query.perPage), 50);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let builder = supabase
    .from("compendium_v2_entries")
    .select("id,nome,thumbnail,category,tags,updated_at", { count: "exact" })
    .eq("user_id", userId);

  if (query.search?.trim()) {
    builder = builder.ilike("nome", `%${query.search.trim()}%`);
  }

  if (query.category?.trim()) {
    builder = builder.eq("category", query.category.trim());
  }

  const normalizedTags = normalizeTags(query.tags);
  if (normalizedTags.length > 0) {
    builder = builder.contains("tags", normalizedTags);
  }

  const { data, error, count } = await builder
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return {
    items: (data ?? []).map((row) => ({
      id: row.id,
      nome: row.nome,
      thumbnail: row.thumbnail,
      category: row.category as CompendiumEntry["category"],
      tags: normalizeTags(row.tags),
      updated_at: row.updated_at,
    })),
    page,
    perPage,
    total,
    totalPages,
  };
}

export async function getCompendiumEntryById(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
): Promise<CompendiumEntry | null> {
  const { data, error } = await supabase
    .from("compendium_v2_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapRow(data);
}

export async function createCompendiumEntry(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CompendiumUpsertInput,
): Promise<CompendiumEntry> {
  const payload: DBCompendiumInsert = {
    user_id: userId,
    nome: input.nome,
    thumbnail: input.thumbnail ?? null,
      data: input.data as DBCompendiumInsert["data"],
    category: input.category,
    tags: normalizeTags(input.tags),
  };

  const { data, error } = await supabase
    .from("compendium_v2_entries")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;

  return mapRow(data);
}

export async function updateCompendiumEntry(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
  input: Partial<CompendiumUpsertInput>,
): Promise<CompendiumEntry | null> {
  const payload: DBCompendiumUpdate = {};

  if (input.nome !== undefined) payload.nome = input.nome;
  if (input.thumbnail !== undefined) payload.thumbnail = input.thumbnail;
    if (input.data !== undefined) {
        payload.data = input.data as DBCompendiumUpdate["data"];
    }
  if (input.category !== undefined) payload.category = input.category;
  if (input.tags !== undefined) payload.tags = normalizeTags(input.tags);

  const { data, error } = await supabase
    .from("compendium_v2_entries")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapRow(data);
}

export async function deleteCompendiumEntry(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
): Promise<boolean> {
  const { error, count } = await supabase
    .from("compendium_v2_entries")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;

  return (count ?? 0) > 0;
}
