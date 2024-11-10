"use client";

import { Suspense } from "react";
import { LoadingSpinner } from "~/app/_components/loading/LoadingSpinner";
import { ResumeContent } from "~/app/_components/resume-viewer/ResumeContent";

interface ResumePageProps {
  user: string;
}

export function ResumeViewerPage({ user }: ResumePageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResumeContent user={user} />
    </Suspense>
  );
}