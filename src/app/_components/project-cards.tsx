"use client";
import { cn } from "~/utils/cn";
import React from "react";
import { CardBody, CardContainer, CardItem } from "~/app/_components/ui/3d-card"
import NextImage from "next/image";
import { replaceMdWithNextLinks } from "~/utils/replace-md-with-next-links";

type EducationCardsProps = {
  items: {
    name: string;
    description: string;
    image: string | null | undefined;
    github: string | null | undefined;
    demo: string | null | undefined;
  }[];

};


export function ProjectCards({ items }: EducationCardsProps) {
  return (
    <>

      {/* <BentoGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"> */}

      {items.map((item, i) => {

        const descriptionWithLinks = replaceMdWithNextLinks(item.description);
        const pressOnItem = () => {
          console.log("opening project", item.name);
          let url = item.demo || item.github || "";
          if (url === "") {
            console.error("No link available for project", item.name);
            return
          }
          url = "https://" + url.replace("https://", "").replace("http://", "");
          window.open(url, "_blank");
        }

        let isClickable = item.demo || item.github ? true : false;

        return (
          <CardContainer className="inter-var mt-0 sm:w-[30rem] w-auto" key={i}>
            <CardBody className="bg-gray-50/70 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black/70 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="30"
                onClick={pressOnItem}
                className={cn(
                  "text-xl font-bold text-neutral-600 dark:text-white",
                  isClickable ? "cursor-pointer" : ""
                )}
              >
                {item.name}
              </CardItem>
              <CardItem
                as="p"
                translateZ="40"
                className={cn(
                  "text-neutral-500 text-sm mt-2 dark:text-neutral-300",
                  isClickable ? "cursor-pointer" : ""
                )}
                onClick={pressOnItem}
              >
                {descriptionWithLinks}
              </CardItem>
              {item.image &&
                // <div className="flex justify-between items-center mt-5">
                  <CardItem translateZ="60"
                    className={cn(
                      "mt-4 bg-white rounded-xl",
                      isClickable ? "cursor-pointer" : ""
                    )}
                    onClick={pressOnItem}
                  >
                    <NextImage
                      src={"/gen/" + item.image}
                      height="1000"
                      width="1000"
                      className="w-full h-full object-contain group-hover/card:shadow-xl rounded-xl"
                      alt="thumbnail"
                    />
                  </CardItem>
                // </div>
              }
              {(item.github || item.demo) &&
                <div className="flex justify-between items-center mt-5">
                  {item.github &&
                    <CardItem
                      translateZ={20}
                      as="button"
                      className="px-4 py-2 rounded-xl bg-black/20 dark:bg-white/20 text-xs font-normal dark:text-white"
                    >
                      <a href={"https://" + item.github.replace("https://", "").replace("http://", "")} target="_blank">Github</a>
                    </CardItem>
                  }
                  {item.demo &&
                    <CardItem
                      translateZ={20}
                      as="button"
                      className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                    >
                      <a href={"https://" + item.demo.replace("https://", "").replace("http://", "")} target="_blank">Demo</a>
                    </CardItem>
                  }
                </div>
              }
            </CardBody>
          </CardContainer>
        )
      })
      }
      {/* </BentoGrid> */}

    </>
  );
}

