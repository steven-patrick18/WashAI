import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  // Setup only exists while there are zero accounts.
  const count = await prisma.user.count().catch(() => 0);
  if (count > 0) redirect("/login");

  return (
    <main className="auth-wrap">
      <AuthForm mode="setup" />
    </main>
  );
}
