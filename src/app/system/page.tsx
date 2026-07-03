import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SystemPanel from "@/components/SystemPanel";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "OWNER") redirect("/");

  return (
    <main className="wrap">
      <SystemPanel />
    </main>
  );
}
