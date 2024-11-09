"use client";

import { WavyBackground } from "~/app/_components/ui/wavy-background"
import { IconDownload, IconFileTypePdf } from "@tabler/icons-react";
import Link from 'next/link'


type DownloadProfessionalResumeButtonProps = {
    filename: string;
};

export default function DownloadProfessionalResumeButton({ filename }: DownloadProfessionalResumeButtonProps) {

    return (
        // centered
        <div className="flex justify-center">
            <Link href={`/${filename}`}>
                <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-black dark:text-white mx-auto text-center rounded-full mt-4 inter-var flex justify-center gap-2">
                    <span>Download Professional Resume instead</span>
                    <IconFileTypePdf size={24} />
                    <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
                </button>
            </Link>
        </div>
    );
}

