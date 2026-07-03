import { prisma } from "@/lib/prisma";
import MastersPanel from "@/components/MastersPanel";

export const dynamic = "force-dynamic";

export default async function MastersPage() {
  const [fabrics, machines] = await Promise.all([
    prisma.fabric.findMany({ orderBy: { name: "asc" } }),
    prisma.machine.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="wrap">
      <MastersPanel
        fabrics={fabrics.map((f) => ({
          id: f.id,
          name: f.name,
          detail: [f.ounce && `${f.ounce}oz`, f.composition, f.supplier]
            .filter(Boolean)
            .join(" · "),
        }))}
        machines={machines.map((m) => ({
          id: m.id,
          name: m.name,
          detail: [m.type, m.capacityKg && `${m.capacityKg}kg`, m.maxTempC && `max ${m.maxTempC}°C`]
            .filter(Boolean)
            .join(" · "),
        }))}
      />
    </main>
  );
}
