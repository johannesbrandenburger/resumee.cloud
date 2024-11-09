"use client";

import { IconBrandGithub, IconBrandLinkedin, IconDownload, IconGlobe, IconMail, IconPhone, IconWorld } from "@tabler/icons-react";
import Link from 'next/link'

type ContactButtonsProps = {
    telephone: string;
    email: string;
    github: string;
    linkedin: string;
    website: string;
};

export default function ContactButtons({ telephone, email, github, linkedin, website }: ContactButtonsProps) {

    // remove the prefixes if there are any
    telephone = telephone?.replace("tel:", "");
    email = email?.replace("mailto:", "");
    github = github?.replace("https://", "");
    linkedin = linkedin?.replace("https://", "");
    website = website?.replace("https://", "");

    return (
        // centered
        <div className="flex justify-center gap-4">
            {telephone &&
                <Link href={`tel:${telephone}`}>
                    <button className="px-4 py-2 backdrop-blur-sm border bg-yellow-300/10 border-yellow-500/20 text-black dark:text-white mx-auto text-center rounded-full mt-4 font-bold inter-var flex justify-center gap-2">
                        <IconPhone size={24} />
                    </button>
                </Link>
            }
            {email &&
                <Link href={`mailto:${email}`}>
                    <button className="px-4 py-2 backdrop-blur-sm border bg-gray-300/10 border-gray-500/20 text-black dark:text-white mx-auto text-center rounded-full mt-4 font-bold inter-var flex justify-center gap-2">
                        <IconMail size={24} />
                    </button>
                </Link>
            }
            {github &&
                <Link href={`https://${github}`}>
                    <button className="px-4 py-2 backdrop-blur-sm border bg-purple-300/10 border-purple-500/20 text-black dark:text-white mx-auto text-center rounded-full mt-4 font-bold inter-var flex justify-center gap-2">
                        <IconBrandGithub size={24} />
                    </button>
                </Link>
            }
            {linkedin &&
                <Link href={`https://${linkedin}`}>
                    <button className="px-4 py-2 backdrop-blur-sm border bg-blue-300/10 border-blue-500/20 text-black dark:text-white mx-auto text-center rounded-full mt-4 font-bold inter-var flex justify-center gap-2">
                        <IconBrandLinkedin size={24} />
                    </button>
                </Link>
            }
            {website &&
                <Link href={`https://${website}`}>
                    <button className="px-4 py-2 backdrop-blur-sm border bg-orange-300/10 border-orange-500/20 text-black dark:text-white mx-auto text-center rounded-full mt-4 font-bold inter-var flex justify-center gap-2">
                        <IconWorld size={24} />
                    </button>
                </Link>
            }
        </div>
    );
}

