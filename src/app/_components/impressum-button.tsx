"use client";

import Link from 'next/link'


type ImpressumButtonProps = {
    link: string;
};

export default function ImpressumButton({ link }: ImpressumButtonProps) {

    if (!link) return null;

    const impressumLink = link.startsWith("http") ? link : "https://" + link;

    return (
        // centered
        <div className="flex justify-center my-5">
            <Link href={impressumLink}>
                <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-black dark:text-white mx-auto text-center rounded-full mt-4 inter-var flex justify-center gap-2 text-xs">
                    <span>Impressum</span>
                </button>
            </Link>
        </div>
    );
}

