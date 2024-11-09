import React from "react";
import { BentoGrid2, BentoGrid2Item } from "./ui/bento-grid-2";
import { replaceMdWithNextLinks } from "~/utils/replace-md-with-next-links";

type ExperienceCardsProps = {
  items: {
    position: string;
    company: string;
    cityAndCountry: string;
    from: string;
    to: string;
    infos: string[];
  }[];

};

export function ExperienceCards({ items }: ExperienceCardsProps) {

  return (
    <BentoGrid2 className="max-w-4xl mx-auto mt-4 h-full">

      {items?.map((item, i) => {

        let itemClassname = "min-h-0 w-full h-full bg-white/70 dark:bg-black/70 border-black/[0.1]";
        itemClassname += " md:col-span-3";

        let itemHeader = (
          <div className="flex flex-col h-full dark:text-white">
            <p className="text-sm mb-2">{item.cityAndCountry}</p>
            <p className="text-sm mb-2">{item.from} - {item.to}</p>

            {item.infos && (
              <div className="flex flex-col">
                {item.infos.map((info, i) => (
                  <li key={i} className="text-sm">{replaceMdWithNextLinks(info)}</li>
                ))}
              </div>
            )
            }
          </div>
        );

        return (
          <BentoGrid2Item
            key={i}
            title={replaceMdWithNextLinks(item.position)}
            description={replaceMdWithNextLinks(item.company)}
            header={itemHeader}
            className={itemClassname}
          />
        )
      })}
    </BentoGrid2>
  );
}
