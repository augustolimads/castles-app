import { SheetsContent } from "@/modules/fichas/ui/sheets-content";
import { Suspense } from "react";

function SheetsContentFallback() {
  return (
    <div className="space-y-6">
      <div className="sticky top-2 bg-secondary py-4 px-4 border rounded-lg animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-4" />
        <div className="h-12 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function FichasPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<SheetsContentFallback />}>
        <SheetsContent />
      </Suspense>
    </div>
  );
}
