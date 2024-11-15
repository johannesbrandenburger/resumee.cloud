"use client";

import { useState, useEffect } from 'react'
import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Textarea } from "~/app/_components/ui/textarea"
import { Label } from "~/app/_components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/app/_components/ui/tabs"
import { PlusCircle, Trash2 } from 'lucide-react'
import { api } from "~/trpc/react"
import { LoadingSpinner } from '~/app/_components/loading/LoadingSpinner';
import StringListInput from '~/app/_components/string-list-input';
import { Base64ImageInput } from '~/app/_components/base64-image-input'
import { Base64ImageViewer } from '~/app/_components/base64-image-viewer'

import { useQueryState } from 'nuqs'
import Link from 'next/link';
import { Avatar, AvatarImage } from '../ui/avatar';

type ResumeFormProps = {
  slug?: string
}

type ResumeFormState = {
  preName: string
  lastName: string
  email: string
  telephone: string | null
  cityAndCountry: string | null
  github: string | null
  linkedin: string | null
  website: string | null
  objective: string | null
  avatar: string | null
  education: {
    id: string;
    cityAndCountry: string;
    degree: string;
    fieldOfStudy: string;
    university: string;
    from: string;
    to: string;
    gradePointAverage: string | null;
    thesis: string | null;
    thesisGrade: string | null;
    expected: string | null;
    flag?: "deleted";
  }[];
  experience: {
    id: string;
    cityAndCountry: string;
    company: string;
    position: string;
    from: string;
    to: string;
    infos: string[];
    flag?: "deleted";
  }[];
  skills: {
    id: string;
    field: string;
    entities: string[];
    flag?: "deleted";
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    image: string | null;
    github: string | null;
    demo: string | null;
    flag?: "deleted";
  }[];
}

export default function ResumeForm({ slug }: ResumeFormProps = {}) {
  // TRPC Queries and Mutations
  let { data: resume } = api.resume.getBySlug.useQuery(slug ?? "", { enabled: !!slug })
  const updateResume = api.resume.update.useMutation()
  const addEducation = api.resume.addEducation.useMutation()
  const addSkillGroup = api.resume.addSkillGroup.useMutation()
  const addExperience = api.resume.addExperience.useMutation()
  const addProject = api.resume.addProject.useMutation()
  const updateEducation = api.resume.updateEducation.useMutation()
  const updateSkillGroup = api.resume.updateSkillGroup.useMutation()
  const updateExperience = api.resume.updateExperience.useMutation()
  const updateProject = api.resume.updateProject.useMutation()
  const deleteEducation = api.resume.deleteEducation.useMutation()
  const deleteSkillGroup = api.resume.deleteSkillGroup.useMutation()
  const deleteExperience = api.resume.deleteExperience.useMutation()
  const deleteProject = api.resume.deleteProject.useMutation()

  // State for tracking changes
  const [resumeForm, setResumeForm] = useState({
    preName: "",
    lastName: "",
    email: "",
    telephone: "",
    cityAndCountry: "",
    github: "",
    linkedin: "",
    website: "",
    objective: "",
    avatar: "",
    education: [],
    experience: [],
    skills: [],
    projects: []
  } as ResumeFormState)
  const [isLoading, setIsLoading] = useState(true)

  // url query state for navigation (tabs)
  const [tab, setTab] = useQueryState("tab", { defaultValue: "Education" })

  // Load resume data
  useEffect(() => {
    if (resume) {
      setResumeForm(resume)
      setIsLoading(false)
    }
  }, [resume])

  // Save changes
  const saveChanges = async () => {

    setIsLoading(true)
    let hasChanges = false

    // update the education (1. case: a existing education was updated, 2. case: a new education was added (id is empty), 3. case: a education was deleted (flag = "deleted"))
    for (let education of resumeForm.education) {
      if (education.flag === "deleted") {
        hasChanges = true
        await deleteEducation.mutateAsync({ resumeSlug: slug ?? "", educationId: education.id })
      } else if (education.id === "") {
        hasChanges = true
        await addEducation.mutateAsync({ resumeSlug: slug ?? "", education: { ...education } })
      } else {
        type EducationFields = {
          cityAndCountry?: string;
          degree?: string;
          fieldOfStudy?: string;
          university?: string;
          from?: string;
          to?: string;
          gradePointAverage?: string;
          thesis?: string;
          thesisGrade?: string;
          expected?: string;
        }
        let educationFieldsChanged: EducationFields = {}
        const prevEducation = resume?.education.find((e) => e.id === education.id)
        for (let key in education) {
          if (["id", "flag", "resumeId"].includes(key)) continue
          const typedKey = key as keyof EducationFields;
          if (JSON.stringify(education[typedKey]) !== JSON.stringify((prevEducation as typeof education)?.[typedKey])) {
            educationFieldsChanged[typedKey] = education[typedKey] === null ? undefined : education[typedKey]
          }
        }
        if (Object.keys(educationFieldsChanged).length > 0) {
          hasChanges = true
          await updateEducation.mutateAsync({ resumeSlug: slug ?? "", educationId: education.id, education: educationFieldsChanged })
        }
      }
    }

    // update the experience (1. case: a existing experience was updated, 2. case: a new experience was added (id is empty), 3. case: a experience was deleted (flag = "deleted"))
    for (let experience of resumeForm.experience) {
      if (experience.flag === "deleted") {
        hasChanges = true
        await deleteExperience.mutateAsync({ resumeSlug: slug ?? "", experienceId: experience.id })
      } else if (experience.id === "") {
        hasChanges = true
        await addExperience.mutateAsync({ resumeSlug: slug ?? "", experience: { ...experience } })
      } else {
        type ExperienceFields = {
          cityAndCountry?: string;
          company?: string;
          position?: string;
          from?: string;
          to?: string;
          infos?: string[];
        }
        let experienceFieldsChanged: ExperienceFields = {}
        const prevExperience = resume?.experience.find((e) => e.id === experience.id)
        for (let key in experience) {
          if (["id", "flag", "resumeId"].includes(key)) continue
          const typedKey = key as keyof ExperienceFields;
          if (JSON.stringify(experience[typedKey]) !== JSON.stringify((prevExperience as typeof experience)?.[typedKey])) {
            if (typedKey === 'infos') {
              experienceFieldsChanged[typedKey] = experience[typedKey] === null ? undefined : experience[typedKey] as string[];
            } else {
              experienceFieldsChanged[typedKey] = experience[typedKey] === null ? undefined : experience[typedKey] as string;
            }
          }
        }
        if (Object.keys(experienceFieldsChanged).length > 0) {
          hasChanges = true
          await updateExperience.mutateAsync({ resumeSlug: slug ?? "", experienceId: experience.id, experience: experienceFieldsChanged })
        }
      }
    }

    // update the skills (1. case: a existing skill was updated, 2. case: a new skill was added (id is empty), 3. case: a skill was deleted (flag = "deleted"))
    for (let skill of resumeForm.skills) {
      if (skill.flag === "deleted") {
        hasChanges = true
        await deleteSkillGroup.mutateAsync({ resumeSlug: slug ?? "", skillGroupId: skill.id })
      } else if (skill.id === "") {
        hasChanges = true
        await addSkillGroup.mutateAsync({ resumeSlug: slug ?? "", skillGroup: { ...skill, id: undefined } })
      } else {
        let skillFieldsChanged = {}
        const prevSkill = resume?.skills.find((s) => s.id === skill.id)
        for (let key in skill) {
          if (["id", "flag", "resumeId"].includes(key)) continue
          if (JSON.stringify(skill[key]) !== JSON.stringify((prevSkill as typeof skill)?.[key])) {
            skillFieldsChanged[key] = skill[key]
          }
        }
        if (Object.keys(skillFieldsChanged).length > 0) {
          hasChanges = true
          await updateSkillGroup.mutateAsync({ resumeSlug: slug ?? "", skillGroupId: skill.id, skillGroup: skillFieldsChanged })
        }
      }
    }

    // update the projects (1. case: a existing project was updated, 2. case: a new project was added (id is empty), 3. case: a project was deleted (flag = "deleted"))
    for (let project of resumeForm.projects) {
      if (project.flag === "deleted") {
        hasChanges = true
        await deleteProject.mutateAsync({ resumeSlug: slug ?? "", projectId: project.id })
      } else if (project.id === "") {
        hasChanges = true
        await addProject.mutateAsync({ resumeSlug: slug ?? "", project: { ...project } })
      } else {
        type ProjectFields = {
          name?: string;
          description?: string;
          image?: string;
          github?: string;
          demo?: string;
        }
        let projectFieldsChanged: ProjectFields = {}
        const prevProject = resume?.projects.find((p) => p.id === project.id)
        for (let key in project) {
          if (["id", "flag", "resumeId"].includes(key)) continue
          const typedKey = key as keyof ProjectFields;
          if (JSON.stringify(project[typedKey]) !== JSON.stringify((prevProject as typeof project)?.[typedKey])) {
            projectFieldsChanged[typedKey] = project[typedKey] === null ? undefined : project[typedKey]
          }
        }
        if (Object.keys(projectFieldsChanged).length > 0) {
          hasChanges = true
          await updateProject.mutateAsync({ resumeSlug: slug ?? "", projectId: project.id, project: projectFieldsChanged })
        }
      }
    }

    // update the general informations (only the one that changed)
    let generalInformationsChanged = {}
    const excludeFields = ["education", "experience", "skills"]
    for (let key in resumeForm) {
      if (excludeFields.includes(key)) continue
      if (resumeForm[key] !== resume[key]) {
        hasChanges = true
        generalInformationsChanged[key] = resumeForm[key]
      }
    }

    // only perform the update if there are changes (also perform it if non-general informations changed (to get the updated data))
    if (hasChanges) {
      const newData = await updateResume.mutateAsync({ slug: slug ?? "", ...generalInformationsChanged })
      resume = newData
      setResumeForm(newData)
    }

    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const linkToResume = process.env.NODE_ENV === "development" ? `http://${slug}.localhost:3000` : `https://${slug}.resumee.cloud`
  const prettierLinkToResume = linkToResume.replace(/(https?:\/\/)/, "")

  return (
    <div className="space-y-4">
      <div className="fixed bottom-0 right-0 p-4">
        <Button variant="default" onClick={saveChanges} className="w-full">Save</Button>
      </div>

      <Card className="m-4">
        <CardHeader>
          <CardTitle>Your resume is available at: <span className="text-blue-500"><Link href={linkToResume}>{prettierLinkToResume}</Link></span></CardTitle>
        </CardHeader>
      </Card>

      <Card className="m-4">
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                Prename
                <Input name="preName" value={resumeForm.preName ?? ''} onChange={(e) => setResumeForm({ ...resumeForm, preName: e.target.value })} placeholder='Max' />
              </Label>
              <Label>
                Lastname
                <Input name="lastName" value={resumeForm.lastName ?? ''} onChange={(e) => setResumeForm({ ...resumeForm, lastName: e.target.value })} placeholder='Mustermann' />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                Email
                <Input name="email" value={resumeForm.email ?? ''} onChange={(e) => setResumeForm({ ...resumeForm, email: e.target.value })} placeholder='contanct@max-mustermann.dev' />
              </Label>
              <Label>
                Telephone
                <Input name="telephone" value={resumeForm.telephone ?? ''} onChange={(e) => setResumeForm({ ...resumeForm, telephone: e.target.value })} placeholder='+49 123 4567890' />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                City and Country
                <Input name="cityAndCountry" value={resumeForm.cityAndCountry ?? ''} onChange={(e) => setResumeForm({ ...resumeForm, cityAndCountry: e.target.value })} placeholder='Konstanz, Germany' />
              </Label>
              <Label>
                Website
                <Input name="website" value={resumeForm.website ?? ''} onChange={(e) => setResumeForm({ ...resumeForm, website: e.target.value })} placeholder='max-mustermann.dev' />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                GitHub
                <Input name="github" value={resumeForm.github ?? ''} onChange={(e) => setResumeForm({ ...resumeForm, github: e.target.value })} placeholder='github.com/max-mustermann' />
              </Label>
              <Label>
                LinkedIn
                <Input name="linkedin" value={resumeForm.linkedin ?? ''} onChange={(e) => setResumeForm({ ...resumeForm, linkedin: e.target.value })} placeholder='linkedin.com/in/max-mustermann' />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Label>
                Objective
                <Textarea name="objective" value={resumeForm.objective ?? ''} onChange={(e) => setResumeForm({ ...resumeForm, objective: e.target.value })} placeholder="I'm Max Mustermann, a software engineer with a passion for web development..." />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                Avatar
                <Base64ImageInput value={resumeForm.avatar ?? ''} onChange={(avatar) => setResumeForm({ ...resumeForm, avatar })} />
              </Label>
              {resumeForm.avatar && (
                <Avatar>
                  <AvatarImage src={resumeForm.avatar ?? ''} />
                </Avatar>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="m-4">
        <CardContent>
          <div>
            <Tabs value={tab} onValueChange={(value) => setTab(value)}>
              <TabsList className="flex space-x-4 mt-4">
                <TabsTrigger className="text-l font-semibold" value="Education">Education</TabsTrigger>
                <TabsTrigger className="text-l font-semibold" value="Experience">Experience</TabsTrigger>
                <TabsTrigger className="text-l font-semibold" value="Skills">Skills</TabsTrigger>
                <TabsTrigger className="text-l font-semibold" value="Projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="Education">
                <div>
                  {resumeForm.education.map((item, index) => {
                    if (item.flag === "deleted") return null
                    return (
                      <Card key={index} className="mt-4">
                        <CardContent className="space-y-4 p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              City and Country
                              <Input name="cityAndCountry" value={item.cityAndCountry ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, cityAndCountry: e.target.value } : education) })
                              }} placeholder='Konstanz, Germany' />
                            </Label>
                            <Label>
                              Degree
                              <Input name="degree" value={item.degree ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, degree: e.target.value } : education) })
                              }} placeholder='Bachelor of Science' />
                            </Label>
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              Field of Study
                              <Input name="fieldOfStudy" value={item.fieldOfStudy ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, fieldOfStudy: e.target.value } : education) })
                              }} placeholder='Computer Science' />
                            </Label>
                            <Label>
                              University
                              <Input name="university" value={item.university ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, university: e.target.value } : education) })
                              }} placeholder='University of Konstanz' />
                            </Label>
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              From
                              <Input name="from" value={item.from ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, from: e.target.value } : education) })
                              }} placeholder='2023' />
                            </Label>
                            <Label>
                              To
                              <Input name="to" value={item.to ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, to: e.target.value } : education) })
                              }} placeholder='2026' />
                            </Label>
                            <Label>
                              Expected (leave empty if already finished)
                              <Input name="expected" value={item.expected ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, expected: e.target.value } : education) })
                              }} placeholder='2026' />
                            </Label>
                          </div>
                          <Label>
                            Thesis
                            <Input name="thesis" value={item.thesis ?? ''} onChange={(e) => {
                              setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, thesis: e.target.value } : education) })
                            }} placeholder='The impact of AI on society' />
                          </Label>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              Grade Point Average
                              <Input name="gradePointAverage" value={item.gradePointAverage ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, gradePointAverage: e.target.value } : education) })
                              }} placeholder='1.3' />
                            </Label>
                            <Label>
                              Thesis Grade
                              <Input name="thesisGrade" value={item.thesisGrade ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, thesisGrade: e.target.value } : education) })
                              }} placeholder='1.0' />
                            </Label>
                          </div>

                          <Button variant="destructive" onClick={() => {
                            if (item.id === "") {
                              setResumeForm({ ...resumeForm, education: resumeForm.education.filter((education, i) => i !== index) })
                              return
                            }
                            setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, flag: "deleted" } : education) })
                          }}><Trash2 size={24} /></Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      className="mt-4"
                      onClick={() => {
                        setResumeForm({ ...resumeForm, education: [...resumeForm.education, { id: "", cityAndCountry: "", degree: "", fieldOfStudy: "", university: "", from: "", to: "", gradePointAverage: "", thesis: "", thesisGrade: "", expected: "" }] })
                      }}><PlusCircle size={24} />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Experience">
                <div>
                  {resumeForm.experience.map((item, index) => {
                    if (item.flag === "deleted") return null;
                    return (
                      <Card key={index} className="mt-4">
                        <CardContent className="space-y-4 p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              City and Country
                              <Input name="cityAndCountry" value={item.cityAndCountry ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, experience: resumeForm.experience.map((exp, i) => i === index ? { ...exp, cityAndCountry: e.target.value } : exp) });
                              }} placeholder='Konstanz, Germany' />
                            </Label>
                            <Label>
                              Company
                              <Input name="company" value={item.company ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, experience: resumeForm.experience.map((exp, i) => i === index ? { ...exp, company: e.target.value } : exp) });
                              }} placeholder='Google' />
                            </Label>
                          </div>
                          <Label>
                            Position
                            <Input name="position" value={item.position ?? ''} onChange={(e) => {
                              setResumeForm({ ...resumeForm, experience: resumeForm.experience.map((exp, i) => i === index ? { ...exp, position: e.target.value } : exp) });
                            }} placeholder='Software Engineer' />
                          </Label>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              From
                              <Input name="from" value={item.from ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, experience: resumeForm.experience.map((exp, i) => i === index ? { ...exp, from: e.target.value } : exp) });
                              }} placeholder='Sep 2023' />
                            </Label>
                            <Label>
                              To
                              <Input name="to" value={item.to ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, experience: resumeForm.experience.map((exp, i) => i === index ? { ...exp, to: e.target.value } : exp) });
                              }} placeholder='Present' />
                            </Label>
                          </div>
                          <Label>
                            Information (Bullet Points)
                            <StringListInput
                              value={item.infos ?? []}
                              onChange={(infos: string[]) => {
                                setResumeForm({ ...resumeForm, experience: resumeForm.experience.map((exp, i) => i === index ? { ...exp, infos } : exp) });
                              }}
                            />
                          </Label>
                          <Button variant="destructive" onClick={() => {
                            setResumeForm({ ...resumeForm, experience: resumeForm.experience.map((exp, i) => i === index ? { ...exp, flag: 'deleted' } : exp) });
                          }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      className="mt-4"
                      onClick={() => {
                        setResumeForm({ ...resumeForm, experience: [...resumeForm.experience, { id: "", cityAndCountry: "", company: "", position: "", from: "", to: "", infos: [] }] });
                      }}><PlusCircle size={24} />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Skills">
                <div>
                  {resumeForm.skills.map((item, index) => {
                    if (item.flag === "deleted") return null;
                    return (
                      <Card key={index} className="mt-4">
                        <CardContent className="space-y-4 p-4">
                          <Label>
                            Field
                            <Input name="field" value={item.field ?? ''} onChange={(e) => {
                              setResumeForm({ ...resumeForm, skills: resumeForm.skills.map((skill, i) => i === index ? { ...skill, field: e.target.value } : skill) });
                            }} placeholder='Programming Languages' />
                          </Label>
                          <Label>
                            Entities
                            <StringListInput
                              value={item.entities ?? []}
                              onChange={(entities: string[]) => {
                                setResumeForm({ ...resumeForm, skills: resumeForm.skills.map((skill, i) => i === index ? { ...skill, entities } : skill) });
                              }}
                            />
                          </Label>
                          <Button variant="destructive" onClick={() => {
                            setResumeForm({ ...resumeForm, skills: resumeForm.skills.map((skill, i) => i === index ? { ...skill, flag: 'deleted' } : skill) });
                          }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      className="mt-4"
                      onClick={() => {
                        setResumeForm({ ...resumeForm, skills: [...resumeForm.skills, { id: "", field: "", entities: [] }] });
                      }}><PlusCircle size={24} />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Projects">
                <div>
                  {resumeForm.projects.map((item, index) => {
                    if (item.flag === "deleted") return null
                    return (
                      <Card key={index} className="mt-4">
                        <CardContent className="space-y-4 p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              Name
                              <Input name="name" value={item.name ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, projects: resumeForm.projects.map((project, i) => i === index ? { ...project, name: e.target.value } : project) })
                              }} placeholder='resumee.cloud: Online resume generator using Next.js' />
                            </Label>
                            <Label>
                              Description
                              <Textarea name="description" value={item.description ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, projects: resumeForm.projects.map((project, i) => i === index ? { ...project, description: e.target.value } : project) })
                              }} placeholder='This project was created to help developers and other professionals to create their own online resume fast and easy.' />
                            </Label>
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              Image
                              <Base64ImageInput value={item.image ?? ''} onChange={(image) => {
                                setResumeForm({ ...resumeForm, projects: resumeForm.projects.map((project, i) => i === index ? { ...project, image } : project) })
                              }} />
                            </Label>
                            {item.image && <Base64ImageViewer value={item.image ?? ''} />}
                            <Label>
                              GitHub
                              <Input name="github" value={item.github ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, projects: resumeForm.projects.map((project, i) => i === index ? { ...project, github: e.target.value } : project) })
                              }} placeholder='github.com/johannesbrandenburger/resumee.cloud' />
                            </Label>
                            <Label>
                              Demo
                              <Input name="demo" value={item.demo ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, projects: resumeForm.projects.map((project, i) => i === index ? { ...project, demo: e.target.value } : project) })
                              }} placeholder='resumee.cloud' />
                            </Label>
                          </div>
                          <Button variant="destructive" onClick={() => {
                            setResumeForm({ ...resumeForm, projects: resumeForm.projects.map((project, i) => i === index ? { ...project, flag: "deleted" } : project) })
                          }}><Trash2 size={24} /></Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      className="mt-4"
                      onClick={() => {
                        setResumeForm({ ...resumeForm, projects: [...resumeForm.projects, { id: "", name: "", description: "", image: "", github: "", demo: "" }] })
                      }}><PlusCircle size={24} />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}
