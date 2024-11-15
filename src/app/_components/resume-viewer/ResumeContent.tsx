import { ErrorDisplay } from "~/app/_components/loading/ErrorDisplay";
import Title from "~/app/_components/title";
import BackgroundAnimation from "~/app/_components/background-animation";
import SectionHeading from "~/app/_components/section-heading";
import { EducationCards } from "~/app/_components/education-cards";
import { ExperienceCards } from "~/app/_components/experience-cards";
import { ProjectCards } from "~/app/_components/project-cards";
import Skills from "~/app/_components/skills";
import ContactButtons from "~/app/_components/contact-buttons";
import ImpressumButton from "~/app/_components/impressum-button";
import ExtracurricularActivities from "~/app/_components/extracurricular-activities";
import { GithubContributionGraph } from "~/app/_components/github-contribution-graph";
import { api } from "~/trpc/react";

interface ResumeContentProps {
  user: string;
}

export const ResumeContent = ({ user }: ResumeContentProps) => {
  const [data] = api.resume.getBySlug.useSuspenseQuery(user);

  if (!data) {
    return <ErrorDisplay message="We couldn't find a resume for this user. Please check the URL and try again." />;
  }

  return (
    <BackgroundAnimation>
      <div className="mx-2">
        <Title 
          preName={data.preName} 
          lastName={data.lastName} 
          objective={data.objective} 
          avatar={data.avatar} 
        />
        <ContactButtons 
          telephone={data.telephone} 
          email={data.email} 
          github={data.github} 
          linkedin={data.linkedin} 
          website={data.website} 
        />

        <SectionHeading visible={data.education?.length > 0}>
          Education
        </SectionHeading>
        <EducationCards items={data.education} />

        <SectionHeading visible={data.skills?.length > 0}>
          Skills
        </SectionHeading>
        <Skills topics={data.skills} />

        <SectionHeading visible={data.experience?.length > 0}>
          Experience
        </SectionHeading>
        <ExperienceCards items={data.experience} />

        <SectionHeading visible={data.projects?.length > 0}>
          Projects
        </SectionHeading>
        <GithubContributionGraph username={data.github?.replace("https://", "").replace("http://", "").replace("github.com/", "").replace("/", "")} />
        <ProjectCards items={data.projects} />

        <SectionHeading visible={data.extracurricular?.length > 0}>
          Extracurricular Activities
        </SectionHeading>
        <ExtracurricularActivities 
          extracurricularActivities={data.extracurricular} 
        />

      </div>
    </BackgroundAnimation>
  );
};