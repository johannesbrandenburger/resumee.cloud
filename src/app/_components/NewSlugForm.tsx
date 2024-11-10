"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ErrorDisplay } from "./loading/ErrorDisplay";

type NewSlugFormProps = {
    suggestion?: string;
};

export function NewSlugForm({ suggestion }: NewSlugFormProps) {
    const [slug, setSlug] = useState<string>(suggestion ?? '');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const createSlug = api.resume.createBySlug.useMutation();

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold text-white">Create your online resume now</h2>
            <p className="text-white">Choose a unique slug for your resume</p>
            <Input placeholder="slug" className="rounded-lg bg-white/10 px-4 py-2 w-80 text-white" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <h3 className="font-bold">
                Your resume will be available at <span className="text-[hsl(280,100%,70%)]">{slug}.resumee.cloud</span>
            </h3>
            <Button className="rounded-lg bg-white/10 px-4 py-2 text-white"
                onClick={async () => {
                    setLoading(true);
                    setError(null);
                    try {
                        await createSlug.mutateAsync(slug);
                        router.refresh();
                    } catch (error: any) {
                        setError(error.message);
                    }
                    setLoading(false);
                }
                }>
                {loading ? 'Creating...' : 'Create'}
            </Button>
            <ErrorDisplay message={error ?? ''} />
        </div>
    );
}