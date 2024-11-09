"use client";

import { useState } from "react";
import Title from "~/app/_components/title";
import DownloadProfessionalResumeButton from "~/app/_components/download-resume";
import BackgroundAnimation from "~/app/_components/background-animation";
import SectionHeading from "~/app/_components/section-heading";
import { EducationCards } from "~/app/_components/education-cards";
import { ExperienceCards } from "~/app/_components/experience-cards";
import { ProjectCards } from "~/app/_components/project-cards";
import Skills from "~/app/_components/skills";
import ContactButtons from "~/app/_components/contact-buttons";
import ImpressumButton from "~/app/_components/impressum-button";
import ExtracurricularActivities from "~/app/_components/extracurricular-activities";

import { api } from "~/trpc/react";

export function ResumePage({ user }: { user: string }) {
  const [data] = api.resume.getBySlug.useSuspenseQuery(user);
  const utils = api.useUtils();
  const [name, setName] = useState("");

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log({ data });
  
  return (
    <>
      <BackgroundAnimation>
        <div className="mx-2">
          <Title preName={data.preName ?? ""} lastName={data.lastName ?? ""} objective={data.objective ?? ""} avatar={data.avatar ?? ""} />
          <ContactButtons 
            telephone={data.telephone ?? ""} 
            email={data.email ?? ""} 
            github={data.github ?? ""} 
            linkedin={data.linkedin ?? ""} 
            website={data.website ?? ""} 
          />
          <DownloadProfessionalResumeButton filename={`resume-${data.preName.toLowerCase()}-${data.lastName.toLowerCase()}.pdf`} />

          <SectionHeading>Education</SectionHeading>
          <EducationCards items={data.education.map(edu => ({
            ...edu,
            expected: edu.expected ?? undefined,
            gradePointAverage: edu.gradePointAverage ?? undefined,
            thesis: edu.thesis ?? undefined,
            thesisGrade: edu.thesisGrade ?? undefined
          }))} />

          <SectionHeading>Skills</SectionHeading>
          <Skills topics={data.skills} />

          <SectionHeading>Experience</SectionHeading>
          <ExperienceCards items={data.experience} />

          <SectionHeading>Projects</SectionHeading>
          <ProjectCards items={data.projects.map(project => ({
            name: project.name,
            description: project.description,
            image: project.image ?? undefined,
            github: project.github ?? undefined,
            demo: project.demo ?? undefined
          }))} />

          <SectionHeading>Extracurricular Activities</SectionHeading>
          <ExtracurricularActivities extracurricularActivities={data.extracurricular ?? []} />
          <ImpressumButton link={data.impressum ?? ""} />
        </div>

      </BackgroundAnimation>
    </>
  )

}
