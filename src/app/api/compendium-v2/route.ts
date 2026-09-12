import { createServerClient } from "@/lib/supabase/server";
import {
    createCompendiumEntry,
    listCompendiumEntries,
} from "@/modules/compendium-v2/data/repository";
import {
    type CompendiumData,
    isCompendiumCategory,
    normalizeTags,
    parseTagsInput,
} from "@/modules/compendium-v2/domain/types";

export const dynamic = "force-dynamic";

function toPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return parsed;
}

export async function GET(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = toPositiveInt(searchParams.get("page"), 1);
  const perPage = Math.min(toPositiveInt(searchParams.get("perPage"), 50), 50);
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const tagsParam = searchParams.get("tags") ?? "";
  const tags = tagsParam ? parseTagsInput(tagsParam) : [];

  if (category && !isCompendiumCategory(category)) {
    return Response.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const data = await listCompendiumEntries(supabase, user.id, {
      page,
      perPage,
      search,
      category,
      tags,
    });

    return Response.json(data);
  } catch (error) {
    console.error("[compendium-v2][GET]", error);
    return Response.json(
      { error: "Failed to load compendium" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: {
    nome?: string;
    thumbnail?: string | null;
    category?: string;
    tags?: string[];
    data?: CompendiumData;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const nome = body.nome?.trim() ?? "";
  const category = body.category?.trim() ?? "";

  if (!nome) {
    return Response.json({ error: "Nome is required" }, { status: 400 });
  }

  if (!isCompendiumCategory(category)) {
    return Response.json({ error: "Invalid category" }, { status: 400 });
  }

  if (!body.data || typeof body.data !== "object") {
    return Response.json({ error: "Data is required" }, { status: 400 });
  }

  try {
    const created = await createCompendiumEntry(supabase, user.id, {
      nome,
      thumbnail: body.thumbnail?.trim() ? body.thumbnail : null,
      category,
      tags: normalizeTags(body.tags),
      data: body.data,
    });

    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error("[compendium-v2][POST]", error);
    return Response.json(
      { error: "Failed to create compendium item" },
      { status: 500 },
    );
  }
}
