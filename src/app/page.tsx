import { headers } from "next/headers";
import Link from "next/link";

import { ResumeViewerPage } from "~/app/_components/resume-viewer/ResumeViewerPage";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import ResumeForm from "./_components/resume-form/ResumeForm";
import { Input } from "./_components/ui/input";
import { Button } from "./_components/ui/button";
import { NewSlugForm } from "./_components/NewSlugForm";

export default async function Home() {

  // get the subdomain from the request
  const allHeaders = await headers();
  const host = allHeaders.get("host");
  let subdomain = host?.split(".").length && host?.split(".").length > 1 ? host?.split(".")[0] : null;
  if (subdomain === "resumee") {
    subdomain = null;
  }


  if (subdomain) {
    return (
      <HydrateClient>
        <ResumeViewerPage user={subdomain} />
      </HydrateClient>
    );
  }

  const session = await auth();

  if (session?.user) {

    let userResumeSlug = await api.resume.getSlugByUserId() ?? undefined;
    if (userResumeSlug) {
      return (
        <HydrateClient>
          <ResumeForm slug={userResumeSlug} />
        </HydrateClient>
      );
    }

    return (
      <HydrateClient>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Welcome to <span className="text-[#cc66ff]">resumee.cloud</span>
            </h1>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-center text-2xl text-white">
                  {session && <span>Logged in as {session.user?.name}</span>}
                </p>
                <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
                  {session ? "Sign out" : "Sign in"}
                </Link>
              </div>
            </div>
            <NewSlugForm suggestion={session.user?.name?.toLowerCase().replace(" ", "-")} />
          </div>
        </main>
      </HydrateClient >
    );
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Welcome to <span className="text-[hsl(280,100%,70%)]">resumee.cloud</span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient >
  );

}
