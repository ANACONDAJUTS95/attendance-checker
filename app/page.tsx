import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { AttendanceApp } from "@/components/AttendanceApp";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="flex justify-end items-center gap-3 px-4 py-2 text-sm text-black/60">
        <span>{session.user.email}</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit" className="font-semibold text-blue-600 hover:text-blue-800 underline">
            Log out
          </button>
        </form>
      </div>
      <AttendanceApp sessionExpires={session.expires} />
    </div>
  );
}
