"use client";

import { WavyBackground } from "~/app/_components/ui/wavy-background"
import { useMediaQuery } from "usehooks-ts";
import { useEffect, useState } from "react";

type BackgroundAnimationProps = {
    children: React.ReactNode;
};

export default function BackgroundAnimation({ children }: BackgroundAnimationProps) {

    const isDarkmode =  useMediaQuery("(prefers-color-scheme: dark)", {
        initializeWithValue: false
    });

    const [backgroundColor, setBackgroundColor] = useState("white");
    useEffect(() => {
        if (isDarkmode) {
            setBackgroundColor("black");
        } else {
            setBackgroundColor("white");
        }
    }, [isDarkmode]);

    return (
        <>
            <div className="relative z-10">
                {children}
            </div>
            <WavyBackground backgroundFill={backgroundColor} />
        </>

    );
}

