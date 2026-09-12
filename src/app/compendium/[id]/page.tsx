import { CompendiumDetailContent } from "@/modules/compendium-v2/ui/compendium-detail-content";

export default async function CompendiumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompendiumDetailContent id={id} />;
}
