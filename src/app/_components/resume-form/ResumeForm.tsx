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
  const { data: resume } = api.resume.getBySlug.useQuery(slug ?? "", { enabled: !!slug })
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="fixed bottom-0 right-0 p-4">
        <Button onClick={() => {
        }} className="w-full">Save</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
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
            <Tabs>
              <TabsList>
                <TabsTrigger value="Education">Education</TabsTrigger>
              </TabsList>
              <TabsContent value="Education">
                <div>
                  {resumeForm.education.map((item, index) => (
                    <div key={index} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Label>
                          City and Country
                          <Input name="cityAndCountry" value={item.cityAndCountry} onChange={(e) => setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, cityAndCountry: e.target.value } : education) })} />
                        </Label>
                        <Label>
                          Degree
                          <Input name="degree" value={item.degree} onChange={(e) => setResumeForm({ ...resumeForm, education: resumeForm.education.map((education, i) => i === index ? { ...education, degree: e.target.value } : education) })} />
                        </Label>
                      </div>
                      <Button onClick={() => {
                        setResumeForm({ ...resumeForm, education: resumeForm.education.filter((_, i) => i !== index) })
                      }}><Trash2 size={24} /></Button>
                    </div>
                  ))}
                  <Button onClick={() => {
                    setResumeForm({ ...resumeForm, education: [...resumeForm.education, { id: "", cityAndCountry: "", degree: "", fieldOfStudy: "", university: "", from: "", to: "", gradePointAverage: "", thesis: "", thesisGrade: "", expected: "" }] })
                  }}><PlusCircle size={24} /></Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
