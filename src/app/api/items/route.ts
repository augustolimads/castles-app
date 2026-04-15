import { items } from '@/modules/itens/items';

// Force static generation at build time
export const dynamic = 'force-static';

export async function GET() {
  return Response.json(items);
}
