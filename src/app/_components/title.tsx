"use client";

import { replaceMdWithNextLinks } from "~/utils/replace-md-with-next-links";
import { Avatar, AvatarFallback, AvatarImage } from "~/app/_components/ui/avatar"


type TitleProps = {
    preName: string;
    lastName: string;
    objective: string | null | undefined;
    avatar: string | null | undefined;
};

export default function Title({ preName, lastName, objective, avatar }: TitleProps) {

    // replace markdown style links "[link text](url)" with next links
    const objectiveWithLinks = objective ? replaceMdWithNextLinks(objective) : "";

    return (
        <>
            <p className="text-base md:text-lg mt-16 text-black dark:text-white font-normal inter-var text-center">
                Online Resume
            </p>
            <p className="text-3xl md:text-5xl lg:text-7xl text-black dark:text-white font-bold inter-var text-center">
                {preName} {lastName}
            </p>
            { avatar && 
                <Avatar className="mx-auto mt-4">
                    <AvatarImage src={"/gen/" + avatar} alt={`${preName} ${lastName}`} />
                    <AvatarFallback>
                        {preName[0]}{lastName[0]}
                    </AvatarFallback>
                </Avatar>
            }
            <p className="text-base md:text-lg mt-4 text-black dark:text-white font-normal inter-var text-center mx-4 mb-6">
                {objectiveWithLinks}
            </p>
        </>
    );
}

