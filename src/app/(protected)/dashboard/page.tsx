import { getSession } from "@/lib/session";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";
import VerifyButton from "@/components/verify-button";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <Navbar userEmail={session.email} />
      <main>
        <h1>Dashboard</h1>
        <p>Welcome, {session.email}</p>
        <p>User ID: {session.userId}</p>
        <VerifyButton />
      </main>
    </>
  );
}
