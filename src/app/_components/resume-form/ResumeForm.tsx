'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Textarea } from "~/app/_components/ui/textarea"
import { Label } from "~/app/_components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card"
import { PlusCircle, Trash2 } from 'lucide-react'
import { api } from "~/trpc/react"


type ResumeFormProps = {
  slug?: string
}

export default function ResumeForm({ slug }: ResumeFormProps = {}) {
  const [resumeData, setResumeData] = useState({
    slug: '',
    preName: '',
    lastName: '',
    telephone: '',
    email: '',
    cityAndCountry: '',
    github: '',
    linkedin: '',
    website: '',
    objective: '',
    domain: '',
    impressum: '',
    avatar: '',
    extracurricular: [] as string[],
    newPageBefore: [] as string[],
    education: [] as any[],
    skills: [] as any[],
    experience: [] as any[],
    projects: [] as any[]
  })

  const [debouncedResumeData] = useDebounce(resumeData, 500)

  const createResume = api.resume.create.useMutation()
  const updateResume = api.resume.update.useMutation()
  const addEducation = api.resume.addEducation.useMutation()
  const addSkillGroup = api.resume.addSkillGroup.useMutation()
  const addExperience = api.resume.addExperience.useMutation()
  const addProject = api.resume.addProject.useMutation()
  const deleteEducation = api.resume.deleteEducation.useMutation()
  const deleteSkillGroup = api.resume.deleteSkillGroup.useMutation()
  const deleteExperience = api.resume.deleteExperience.useMutation()
  const deleteProject = api.resume.deleteProject.useMutation()
  const updateEducation = api.resume.updateEducation.useMutation()
  const updateSkillGroup = api.resume.updateSkillGroup.useMutation()
  const updateExperience = api.resume.updateExperience.useMutation()
  const updateProject = api.resume.updateProject.useMutation()
  
  const [fetchedData] = slug ? api.resume.getBySlug.useSuspenseQuery(slug) : [null]

  useEffect(() => {
    if (fetchedData) {
      setResumeData(fetchedData as any)
    }
  }, [fetchedData])

  useEffect(() => {
    if (debouncedResumeData.slug) {
      if (slug) {
        updateResume.mutate(debouncedResumeData)
      } else {
        createResume.mutate(debouncedResumeData)
      }
    }
  }, [debouncedResumeData, slug])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResumeData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddEducation = () => {
    addEducation.mutate({
      resumeSlug: resumeData.slug,
      education: {
        degree: '',
        fieldOfStudy: '',
        university: '',
        cityAndCountry: '',
        from: '',
        to: '',
      }
    }, {
      onSuccess: (newEducation) => {
        setResumeData(prev => ({
          ...prev,
          education: [...prev.education, newEducation]
        }))
      }
    })
  }

  const handleUpdateEducation = (id: string, field: string, value: string) => {
    updateEducation.mutate({
      resumeSlug: resumeData.slug,
      educationId: id,
      education: { [field]: value }
    }, {
      onSuccess: () => {
        setResumeData(prev => ({
          ...prev,
          education: prev.education.map(edu => 
            edu.id === id ? { ...edu, [field]: value } : edu
          )
        }))
      }
    })
  }

  const handleDeleteEducation = (id: string) => {
    deleteEducation.mutate({
      resumeSlug: resumeData.slug,
      educationId: id
    }, {
      onSuccess: () => {
        setResumeData(prev => ({
          ...prev,
          education: prev.education.filter(edu => edu.id !== id)
        }))
      }
    })
  }

  // Similar handlers for skills, experience, and projects...

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preName">First Name</Label>
              <Input id="preName" name="preName" value={resumeData.preName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={resumeData.lastName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={resumeData.email} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="telephone">Telephone</Label>
              <Input id="telephone" name="telephone" type="tel" value={resumeData.telephone} onChange={handleInputChange} />
            </div>
            {/* Add more fields for personal information */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4 p-4 border rounded">
              <Input 
                placeholder="Degree" 
                value={edu.degree} 
                onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)} 
              />
              <Input 
                placeholder="Field of Study" 
                value={edu.fieldOfStudy} 
                onChange={(e) => handleUpdateEducation(edu.id, 'fieldOfStudy', e.target.value)} 
              />
              {/* Add more fields for education */}
              <Button onClick={() => handleDeleteEducation(edu.id)} variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          ))}
          <Button onClick={handleAddEducation}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Education
          </Button>
        </CardContent>
      </Card>

      {/* Add similar sections for Skills, Experience, and Projects */}

    </div>
  )
}