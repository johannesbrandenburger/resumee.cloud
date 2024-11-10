"use client";

import { Suspense } from "react";
import { LoadingSpinner } from "~/app/_components/loading/LoadingSpinner";
import ResumeForm from "./ResumeForm";

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