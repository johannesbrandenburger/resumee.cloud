"use client";

import { replaceMdWithNextLinks } from "~/utils/replace-md-with-next-links";



type ExtracurricularActivitiesProps = {
    extracurricularActivities: string[];
};

export default function ExtracurricularActivities({ extracurricularActivities }: ExtracurricularActivitiesProps) {

    // display them under each other if at least one entry is more than 50 characters long
    let convertedExtracurricularActivities = extracurricularActivities?.map((activity) => { return replaceMdWithNextLinks(activity) });

    return (
        <>

            <div className="justify-center">

                {convertedExtracurricularActivities?.map((extracurricularActivity, index) => {
                    return (
                        <div key={index} className="mx-8">
                            <div className="list-disc mt-4 list-inside text-base text-black dark:text-white font-normal max-w-100 justify-center text-center">
                                    {extracurricularActivity.map((entity, index) => {
                                        return (
                                            <p key={index} className="mb-2">
                                                {entity}
                                            </p>
                                        );
                                    })}
                                </div>
                        </div>
                    );
                })}

            </div>
        </>
    );
}

