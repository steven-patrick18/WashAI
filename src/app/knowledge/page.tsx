import { prisma } from "@/lib/prisma";
import KnowledgePanel from "@/components/KnowledgePanel";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, sizeBytes: true, createdAt: true },
  });

  return (
    <main className="wrap">
      <KnowledgePanel
        documents={documents.map((d) => ({
          id: d.id,
          title: d.title,
          sizeMb: Math.round((d.sizeBytes / 1024 / 1024) * 10) / 10,
          date: d.createdAt.toLocaleDateString(),
        }))}
      />
    </main>
  );
}
