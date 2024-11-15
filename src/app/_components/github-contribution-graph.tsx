"use client";
import GitHubCalendar from 'react-github-calendar';
import { CardBody, CardContainer, CardItem } from './ui/3d-card';
import { cn } from '~/utils/cn';

type GithubContributionGraphProps = {
    username?: string;
};

export function GithubContributionGraph({ username }: GithubContributionGraphProps) {
    if (!username) {
        return null;
    }

    return (
        <CardContainer className="inter-var w-full max-w-4xl mx-auto mt-4 h-full">
            <CardBody className="bg-gray-50/70 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black/60 dark:border-green-300/[0.2] border-green-950/[0.6] w-full h-auto rounded-xl p-6 border overflow-x-auto">
                <CardItem
                    className={cn(
                        "text-xl font-bold text-neutral-600 dark:text-white",
                    )}
                    translateZ="30"
                >
                    {"Github Contribution Graph for " + username}
                </CardItem>
                <CardItem
                    as="p"
                    className={cn(
                        "text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                    )}
                    translateZ="40"
                >
                    <GitHubCalendar username={username} />
                </CardItem>
            </CardBody>
        </CardContainer>
    );
}
