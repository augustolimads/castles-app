"use client";

import { Pagination } from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CompendiumListSort } from "../data/repository";
import type { CompendiumListResponse } from "../domain/types";
import { parseTagsInput } from "../domain/types";
import { CompendiumTable } from "./compendium-table";
import { FiltersModal } from "./filters-modal";
import { Header } from "./header";

export function CompendiumListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [items, setItems] = useState<CompendiumListResponse["items"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    perPage: 50,
    total: 0,
    totalPages: 1,
  });
  const [pendingCategory, setPendingCategory] = useState(
    searchParams.get("category") ?? "all",
  );
  const [pendingTagsInput, setPendingTagsInput] = useState(
    searchParams.get("tags") ?? "",
  );

  const page = Number.parseInt(searchParams.get("page") ?? "1", 10) || 1;
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const tags = searchParams.get("tags") ?? "";
    const sort =
        (searchParams.get("sort") as CompendiumListSort | null) ?? "updated_desc";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("perPage", "50");

    if (search.trim()) params.set("search", search.trim());
    if (category.trim()) params.set("category", category.trim());
    if (tags.trim()) params.set("tags", tags.trim());
      if (sort !== "updated_desc") params.set("sort", sort);

    return params.toString();
  }, [page, search, category, sort, tags]);

  const updateSearchParams = useCallback(
    (updates: {
      search?: string;
      category?: string;
      tags?: string;
        sort?: CompendiumListSort;
      page?: number;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.search !== undefined) {
        if (updates.search.trim()) params.set("search", updates.search.trim());
        else params.delete("search");
      }

      if (updates.category !== undefined) {
        if (updates.category.trim())
          params.set("category", updates.category.trim());
        else params.delete("category");
      }

      if (updates.tags !== undefined) {
        if (updates.tags.trim()) params.set("tags", updates.tags.trim());
        else params.delete("tags");
      }

      if (updates.page !== undefined) {
        if (updates.page <= 1) params.delete("page");
        else params.set("page", String(updates.page));
      }

          if (updates.sort !== undefined) {
              if (updates.sort === "updated_desc") params.delete("sort");
              else params.set("sort", updates.sort);
          }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    setPendingCategory(category || "all");
    setPendingTagsInput(tags);
  }, [category, tags]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
          const response = await fetch(`/api/compendium-v2?${queryString}`);
        const data = (await response.json()) as
          | CompendiumListResponse
          | { error?: string };

        if (!response.ok) {
          throw new Error("error" in data ? data.error : "Falha ao carregar");
        }

        if (!cancelled) {
          const payload = data as CompendiumListResponse;
          setItems(payload.items);
          setPageInfo({
            page: payload.page,
            perPage: payload.perPage,
            total: payload.total,
            totalPages: payload.totalPages,
          });
        }
      } catch (cause) {
        if (!cancelled) {
          const message =
            cause instanceof Error ? cause.message : "Falha inesperada";
          setError(message);
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [queryString]);

  const handleApplyFilters = () => {
    updateSearchParams({
      category: pendingCategory === "all" ? "" : pendingCategory,
      tags: parseTagsInput(pendingTagsInput).join(","),
      page: 1,
    });
    setIsFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setPendingCategory("all");
    setPendingTagsInput("");
    updateSearchParams({ category: "", tags: "", page: 1 });
    setIsFiltersOpen(false);
  };

  const startIndex =
    pageInfo.total === 0 ? 0 : (pageInfo.page - 1) * pageInfo.perPage + 1;
  const endIndex = Math.min(pageInfo.page * pageInfo.perPage, pageInfo.total);

  return (
    <div className="space-y-4">
      <Header
        search={search}
        onSearchChange={(value) =>
          updateSearchParams({ search: value, page: 1 })
        }
        onOpenFilters={() => setIsFiltersOpen(true)}
        onCreate={() => router.push("/compendium/new")}
      />

      <FiltersModal
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        category={pendingCategory}
        tagsInput={pendingTagsInput}
        onCategoryChange={setPendingCategory}
        onTagsInputChange={setPendingTagsInput}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {loading && (
        <div className="text-sm text-muted-foreground">
          Carregando compendium...
        </div>
      )}
      {error && <div className="text-sm text-destructive">{error}</div>}

      {!loading && !error && (
        <>
          <CompendiumTable
            items={items}
            onOpenItem={(id) => router.push(`/compendium/${id}`)}
            onEditItem={(id) => router.push(`/compendium/${id}?edit=1`)}
                      sort={sort}
                      onSortChange={(nextSort) =>
                          updateSearchParams({ sort: nextSort, page: 1 })
                      }
          />

          {items.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              Nenhum registro encontrado.
            </div>
          )}

          {pageInfo.totalPages > 1 && (
            <Pagination
              currentPage={pageInfo.page}
              totalPages={pageInfo.totalPages}
              totalItems={pageInfo.total}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={(nextPage) =>
                updateSearchParams({ page: nextPage })
              }
              onNext={() => updateSearchParams({ page: pageInfo.page + 1 })}
              onPrevious={() => updateSearchParams({ page: pageInfo.page - 1 })}
              hasNextPage={pageInfo.page < pageInfo.totalPages}
              hasPreviousPage={pageInfo.page > 1}
            />
          )}
        </>
      )}
    </div>
  );
}
