import { prisma } from "@/lib/prisma";
import RecipeForm from "@/components/RecipeForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Load master data server-side so the form can offer real fabrics/machines.
  // Falls back gracefully if the database isn't reachable yet.
  let fabrics: { id: string; name: string }[] = [];
  let machines: { id: string; name: string }[] = [];
  let dbError = false;

  try {
    [fabrics, machines] = await Promise.all([
      prisma.fabric.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
      prisma.machine.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    ]);
  } catch {
    dbError = true;
  }

  return (
    <main className="wrap">
      {dbError && (
        <div className="error">
          Could not reach the database. Start Postgres (<code>docker compose up -d</code>)
          then run <code>npm run db:push &amp;&amp; npm run db:seed</code>. You can still
          generate recipes without selecting a saved fabric/machine.
        </div>
      )}
      <RecipeForm fabrics={fabrics} machines={machines} />
    </main>
  );
}
