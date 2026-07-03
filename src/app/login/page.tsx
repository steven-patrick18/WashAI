import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // First run (no accounts yet) → owner setup instead of login.
  const count = await prisma.user.count().catch(() => 0);
  if (count === 0) redirect("/setup");

  return (
    <main className="auth-wrap">
      <AuthForm mode="login" />
    </main>
  );
}
