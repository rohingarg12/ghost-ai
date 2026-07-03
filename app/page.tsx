import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

/**
 * Root entry point — no UI of its own.
 *
 * Authenticated users go to the editor; unauthenticated users go to sign-in.
 * (Unauthenticated requests are also caught earlier by `proxy.ts`, so this
 * branch is a defensive fallback.)
 */
export default async function Home() {
  const { userId } = await auth();
  redirect(userId ? "/editor" : "/sign-in");
}
