import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import UsersPanel from "@/components/UsersPanel";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "OWNER") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <main className="wrap">
      <UsersPanel
        selfId={session.userId}
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          date: u.createdAt.toLocaleDateString(),
        }))}
      />
    </main>
  );
}
