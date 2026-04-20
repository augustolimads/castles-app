import { spells } from "@/modules/feiticos/feiticos";
import { SpellsContent } from "@/modules/feiticos/ui/spells-content";

export default function FeiticosPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <SpellsContent spells={spells} />
    </div>
  );
}