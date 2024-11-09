"use client";

import { replaceMdWithNextLinks } from "~/utils/replace-md-with-next-links";


type SkillsProps = {
    topics: {
        field: string;
        entities: string[];
    }[];
};

export default function Skills({ topics }: SkillsProps) {

    // display them under each other if at least one entry is more than 50 characters long
    let convertedTopics = topics.map((topic) => {
        return {
            field: replaceMdWithNextLinks(topic.field),
            entities: topic.entities.map((entity) => replaceMdWithNextLinks(entity)),
            underEachOther: topic.entities.some((entity) => entity.length > 50)
        };
    });

    return (
        <>

            <div className="justify-center">

                {convertedTopics.map((topic, index) => {
                    return (
                        <div key={index} className="mx-8">
                            <p className="text-l mt-4 md:text-xl lg:text-2xl text-black dark:text-white font-bold text-center">
                                {topic.field}
                            </p>
                            {topic.underEachOther &&
                                <div className="list-disc list-inside text-base text-black dark:text-white font-normal max-w-100 justify-center text-center">
                                    {topic.entities.map((entity, index) => {
                                        return (
                                            <p key={index} className="mb-2">
                                                {entity}
                                            </p>
                                        );
                                    })}
                                </div>
                            }
                            {!topic.underEachOther &&
                                <div className="flex flex-wrap justify-center">
                                    {topic.entities.map((entity, index) => {
                                        return (
                                            <p key={index} className="m-2">
                                                {entity}
                                            </p>
                                        );
                                    })}
                                </div>
                            }
                        </div>
                    );
                })}

            </div>
        </>
    );
}

