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
import { LoadingSpinner } from '../loading/LoadingSpinner';

type ResumeFormProps = {
  slug?: string
}

type ResumeFormState = {
  preName: string
  lastName: string
  email: string
  telephone?: string
  cityAndCountry?: string
  github?: string
  linkedin?: string
  website?: string
  objective?: string
  domain?: string
  impressum?: string,
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
  }[];
  skills: {
    id: string;
    field: string;
    entities: string[];
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
    domain: "",
    impressum: "",
    education: [],
    experience: [],
    skills: []
  } as ResumeFormState)
  const [isLoading, setIsLoading] = useState(true)

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
        await addEducation.mutateAsync({ resumeSlug: slug ?? "", education: { ...education, id: undefined } })
      } else {
        let educationFieldsChanged = {}
        const prevEducation = resume?.education.find((e) => e.id === education.id)
        for (let key in education) {
          if (["id", "flag", "resumeId"].includes(key)) continue
          if (education[key] !== prevEducation[key]) {
            educationFieldsChanged[key] = education[key]
          }
        }
        if (Object.keys(educationFieldsChanged).length > 0) {
          hasChanges = true
          await updateEducation.mutateAsync({ resumeSlug: slug ?? "", educationId: education.id, education: educationFieldsChanged })
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

  return (
    <div className="space-y-4">
      <div className="fixed bottom-0 right-0 p-4">
        <Button variant="default" onClick={saveChanges} className="w-full">Save</Button>
      </div>

      <Card className="m-4">
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                Prename
                <Input name="preName" value={resumeForm.preName} onChange={(e) => setResumeForm({ ...resumeForm, preName: e.target.value })} />
              </Label>
              <Label>
                Lastname
                <Input name="lastName" value={resumeForm.lastName} onChange={(e) => setResumeForm({ ...resumeForm, lastName: e.target.value })} />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                Email
                <Input name="email" value={resumeForm.email} onChange={(e) => setResumeForm({ ...resumeForm, email: e.target.value })} />
              </Label>
              <Label>
                Telephone
                <Input name="telephone" value={resumeForm.telephone} onChange={(e) => setResumeForm({ ...resumeForm, telephone: e.target.value })} />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                City and Country
                <Input name="cityAndCountry" value={resumeForm.cityAndCountry} onChange={(e) => setResumeForm({ ...resumeForm, cityAndCountry: e.target.value })} />
              </Label>
              <Label>
                Website
                <Input name="website" value={resumeForm.website} onChange={(e) => setResumeForm({ ...resumeForm, website: e.target.value })} />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                GitHub
                <Input name="github" value={resumeForm.github} onChange={(e) => setResumeForm({ ...resumeForm, github: e.target.value })} />
              </Label>
              <Label>
                LinkedIn
                <Input name="linkedin" value={resumeForm.linkedin} onChange={(e) => setResumeForm({ ...resumeForm, linkedin: e.target.value })} />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Label>
                Objective
                <Textarea name="objective" value={resumeForm.objective} onChange={(e) => setResumeForm({ ...resumeForm, objective: e.target.value })} />
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                Domain
                <Input name="domain" value={resumeForm.domain} onChange={(e) => setResumeForm({ ...resumeForm, domain: e.target.value })} />
              </Label>
              <Label>
                Impressum
                <Input name="impressum" value={resumeForm.impressum} onChange={(e) => setResumeForm({ ...resumeForm, impressum: e.target.value })} />
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="m-4">
        <CardContent>
          <div>
            <Tabs defaultValue="Education">
              <TabsList className="flex space-x-4 mt-4">
                <TabsTrigger value="Education">Education</TabsTrigger>
                <TabsTrigger value="Experience">Experience</TabsTrigger>
                <TabsTrigger value="Skills">Skills</TabsTrigger>
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
                              <Input name="cityAndCountry" value={item.cityAndCountry} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, cityAndCountry: e.target.value } : education) })
                              }} />
                            </Label>
                            <Label>
                              Degree
                              <Input name="degree" value={item.degree} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, degree: e.target.value } : education) })
                              }} />
                            </Label>
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              Field of Study
                              <Input name="fieldOfStudy" value={item.fieldOfStudy} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, fieldOfStudy: e.target.value } : education) })
                              }} />
                            </Label>
                            <Label>
                              University
                              <Input name="university" value={item.university} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, university: e.target.value } : education) })
                              }} />
                            </Label>
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              From
                              <Input type="date" name="from" value={item.from} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, from: e.target.value } : education) })
                              }} />
                            </Label>
                            <Label>
                              To
                              <Input type="date" name="to" value={item.to} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, to: e.target.value } : education) })
                              }} />
                            </Label>
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Label>
                              Grade Point Average
                              <Input name="gradePointAverage" value={item.gradePointAverage ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, gradePointAverage: e.target.value } : education) })
                              }} />
                            </Label>
                            <Label>
                              Thesis
                              <Input name="thesis" value={item.thesis ?? ''} onChange={(e) => {
                                setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, thesis: e.target.value } : education) })
                              }} />
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
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
