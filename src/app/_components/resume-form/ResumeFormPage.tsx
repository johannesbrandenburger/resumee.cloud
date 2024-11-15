"use client";

import { Suspense } from "react";
import { LoadingSpinner } from "~/app/_components/loading/LoadingSpinner";
import ResumeForm from "~/app/_components/resume-form/ResumeForm";

interface ResumePageProps {
  slug?: string;
}

export function ResumeFormPage({ slug }: ResumePageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResumeForm slug={slug} />
    </Suspense>
  );
}