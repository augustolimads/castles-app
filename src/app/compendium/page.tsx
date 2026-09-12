import { CompendiumListContent } from "@/modules/compendium-v2/ui/compendium-list-content";
import { Suspense } from "react";

function CompendiumFallback() {
  return (
    <div className="space-y-4">
      <div className="h-20 rounded-lg border bg-muted animate-pulse" />
      <div className="h-96 rounded-lg border bg-muted animate-pulse" />
    </div>
  );
}

export default function CompendiumPage() {
  return (
    <Suspense fallback={<CompendiumFallback />}>
      <CompendiumListContent />
    </Suspense>
  );
}
