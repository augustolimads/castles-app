const SKELETON_KEYS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
  "skeleton-7",
  "skeleton-8",
  "skeleton-9",
  "skeleton-10",
  "skeleton-11",
  "skeleton-12",
];

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="sticky top-2 left-0 right-0 bg-secondary flex items-center justify-between py-2 px-2 border rounded-lg">
        <div className="w-4/12 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="w-24 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-24 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-10 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
      <div className="py-4 grid grid-cols lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {SKELETON_KEYS.map((key) => (
          <div
            key={key}
            className="h-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
