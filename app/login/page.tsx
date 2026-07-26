import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-8 bg-[#E2F1F6] px-4">
      <h1 className="text-4xl font-black uppercase text-[#111111] mb-8">Attendance Checker</h1>
      <LoginForm initialErrorCode={error} />
    </div>
  );
}
