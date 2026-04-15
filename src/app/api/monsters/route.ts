import { monsters } from '@/modules/compendium/monsters';

// Force static generation at build time
export const dynamic = 'force-static';

export async function GET() {
  return Response.json(monsters);
}
