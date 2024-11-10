import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconProgress,
  IconCertificate2
} from "@tabler/icons-react";

type EducationCardsProps = {
  items: {
    degree: string;
    fieldOfStudy: string;
    university: string;
    cityAndCountry: string;
    from: string;
    to: string;
    expected: string | null | undefined;
    gradePointAverage: string | null | undefined;
    thesis: string | null | undefined;
    thesisGrade: string | null | undefined;
  }[];

};

export function EducationCards({ items }: EducationCardsProps) {

  return (
    <BentoGrid className="max-w-4xl mx-auto mt-4 h-full">

      {items?.map((item, i) => {

        let itemClassname = "min-h-0 w-full h-full bg-white/70 dark:bg-black/70 border-black/[0.1]";
        if (item.thesis) {
          itemClassname += " md:col-span-2";
        } else {
          itemClassname += " md:col-span-1";
        }

        let itemHeader = (
          <div className="flex flex-col h-full dark:text-neutral-200">
            <p className="text-sm">{item.university}</p>
            <p className="text-sm mb-2">{item.cityAndCountry}</p>
            <p className="text-sm mb-2">{item.from} - {item.expected ? "Expected " + item.expected : item.to}</p>
            { item.thesis && <div className="flex flex-col">
              <p className="text-sm italic">{`Thesis: ${item.thesis}`}{item.thesisGrade && ` (Grade: ${item.thesisGrade})`}</p>
            </div>}
          </div>
        );

        let itemIconAndGrade = (
          <div className="flex dark:text-neutral-200">
            <div className="mr-1">{item.expected ? <IconProgress color="blue"/> : <IconCertificate2 color="green"/>}</div>
            {item.gradePointAverage && <p className="dark:text-neutral-200">{item.expected && "Curr. "}Avg: {item.gradePointAverage}</p>}
          </div>
        );

        return (
          <BentoGridItem
            key={i}
            title={item.degree}
            description={item.fieldOfStudy}
            header={itemHeader}
            icon={itemIconAndGrade}
            className={itemClassname}
          />
        )
      })}
    </BentoGrid>
  );
}