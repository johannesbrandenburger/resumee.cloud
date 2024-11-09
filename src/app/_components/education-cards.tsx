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
    expected?: string;
    gradePointAverage?: string;
    thesis?: string;
    thesisGrade?: string;
  }[];

};

export function EducationCards({ items }: EducationCardsProps) {

  //     "degree": "Bachelor of Science",
  //     "fieldOfStudy": "Computer Science (Information Technology)",
  //     "university": "DHBW Ravensburg (Cooperative State University)",
  //     "cityAndCountry": "Ravensburg, Germany",
  //     "from": "2020",
  //     "to": "2023",
  //     "gradePointAverage": "1.3",
  //     "thesis": "Zentrale Plattform für die Analyse und Verwaltung der Code-Sicherheit in Unternehmenssoftwaresystemen",
  //     "thesisGrade": "1.0"

  return (
    <BentoGrid className="max-w-4xl mx-auto mt-4 h-full">

      {items.map((item, i) => {

        let itemClassname = "min-h-0 w-full h-full bg-white/70 dark:bg-black/70 border-black/[0.1]";
        if (item.thesis) {
          itemClassname += " md:col-span-2";
        } else {
          itemClassname += " md:col-span-1";
        }

        let itemHeader = (
          <div className="flex flex-col h-full">
            <p className="text-sm">{item.university}</p>
            <p className="text-sm mb-2">{item.cityAndCountry}</p>
            <p className="text-sm mb-2">{item.from} - {item.expected ? "Expected " + item.expected : item.to}</p>
            { item.thesis && <div className="flex flex-col">
              <p className="text-sm italic">{`Thesis: ${item.thesis}`}{item.thesisGrade && ` (Grade: ${item.thesisGrade})`}</p>
            </div>}
          </div>
        );

        let itemIconAndGrade = (
          // nebeneinander
          <div className="flex">
            <div className="mr-1">{item.expected ? <IconProgress color="blue"/> : <IconCertificate2 color="green"/>}</div>
            {item.gradePointAverage && <p className="">{item.expected && "Curr. "}Avg: {item.gradePointAverage}</p>}
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