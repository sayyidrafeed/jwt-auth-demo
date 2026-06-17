import { getSession } from "@/lib/session";
import Navbar from "@/components/navbar";
import Link from "next/link";
import VerifyButton from "@/components/verify-button";

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <Navbar userEmail={session?.email ?? null} />
      <main>
        <h1>JWT Authentication Demo</h1>
        {session ? (
          <Link href="/dashboard">Go to Dashboard</Link>
        ) : (
          <>
            <Link href="/sign-up">Sign Up</Link>
            <Link href="/sign-in">Sign In</Link>
          </>
        )}
        <VerifyButton />
      </main>
    </>
  );
}
