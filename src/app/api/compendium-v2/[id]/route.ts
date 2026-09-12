import { createServerClient } from "@/lib/supabase/server";
import {
    deleteCompendiumEntry,
    getCompendiumEntryByIdCached,
    updateCompendiumEntry,
} from "@/modules/compendium-v2/data/repository";
import {
    type CompendiumData,
    isCompendiumCategory,
    normalizeTags,
} from "@/modules/compendium-v2/domain/types";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
      const entry = await getCompendiumEntryByIdCached(supabase, user.id, id);

    if (!entry) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(entry);
  } catch (error) {
    console.error("[compendium-v2][GET by id]", error);
    return Response.json(
      { error: "Failed to load compendium item" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
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

    const category = body.category;

    if (category !== undefined && !isCompendiumCategory(category)) {
    return Response.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const updated = await updateCompendiumEntry(supabase, user.id, id, {
      nome: body.nome?.trim(),
      thumbnail:
        body.thumbnail === undefined
          ? undefined
          : body.thumbnail?.trim()
            ? body.thumbnail
            : null,
        category,
      tags: body.tags ? normalizeTags(body.tags) : undefined,
      data: body.data,
    });

    if (!updated) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

      revalidateTag(`compendium-v2:${user.id}`, "max");
      revalidateTag(`compendium-v2:${user.id}:list`, "max");
      revalidateTag(`compendium-v2:${user.id}:item:${id}`, "max");

    return Response.json(updated);
  } catch (error) {
    console.error("[compendium-v2][PATCH]", error);
    return Response.json(
      { error: "Failed to update compendium item" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const deleted = await deleteCompendiumEntry(supabase, user.id, id);

    if (!deleted) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

      revalidateTag(`compendium-v2:${user.id}`, "max");
      revalidateTag(`compendium-v2:${user.id}:list`, "max");
      revalidateTag(`compendium-v2:${user.id}:item:${id}`, "max");

    return Response.json({ success: true });
  } catch (error) {
    console.error("[compendium-v2][DELETE]", error);
    return Response.json(
      { error: "Failed to delete compendium item" },
      { status: 500 },
    );
  }
}
