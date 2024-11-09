'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Textarea } from "~/app/_components/ui/textarea"
import { Label } from "~/app/_components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card"
import { PlusCircle, Trash2 } from 'lucide-react'
import { api } from "~/trpc/react";

type ResumeFormProps = {
  slug?: string
}

export function ResumeFormComponent({ slug }: ResumeFormProps = {}) {

  const emptyData = {
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
    extracurricular: [],
    newPageBefore: [],
    education: [],
    skills: [],
    experience: [],
    projects: []
  }

  const [data] = (slug ? api.resume.getBySlug.useSuspenseQuery(slug) : [emptyData]) as any

  const [formData, setFormData] = useState(data)

  const [debouncedFormData] = useDebounce(formData, 500)

  const createResume = api.resume.create.useMutation()
  const updateResume = api.resume.update.useMutation()
  const addEducation = api.resume.addEducation.useMutation()
  const addSkillGroup = api.resume.addSkillGroup.useMutation()
  const addExperience = api.resume.addExperience.useMutation()
  const addProject = api.resume.addProject.useMutation()

  useEffect(() => {
    if (slug) {
      updateResume.mutate(debouncedFormData)
    } else if (debouncedFormData.slug) {
      createResume.mutate(debouncedFormData)
    }
  }, [debouncedFormData, slug])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleArrayInputChange = (index: number, field: string, subfield: string, value: string | string[]) => {
    setFormData((prev: { [x: string]: any }) => {
      const newArray = [...prev[field]]
      newArray[index] = { ...newArray[index], [subfield]: value }
      return { ...prev, [field]: newArray }
    })
  }

  const addArrayItem = (field: string) => {
    setFormData((prev: { [x: string]: any }) => ({ ...prev, [field]: [...prev[field], {}] }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev: { [x: string]: any[] }) => ({
      ...prev,
      [field]: prev[field]?.filter((_: any, i: number) => i !== index)
    }))
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="preName">First Name</Label>
              <Input id="preName" name="preName" value={formData.preName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="telephone">Telephone</Label>
              <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="cityAndCountry">City and Country</Label>
              <Input id="cityAndCountry" name="cityAndCountry" value={formData.cityAndCountry} onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" name="github" value={formData.github} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" value={formData.website} onChange={handleInputChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="objective">Objective</Label>
            <Textarea id="objective" name="objective" value={formData.objective} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="domain">Domain</Label>
            <Input id="domain" name="domain" value={formData.domain} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="impressum">Impressum</Label>
            <Textarea id="impressum" name="impressum" value={formData.impressum} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.education?.map((edu: any, index: number) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                  <Input
                    id={`edu-degree-${index}`}
                    value={edu.degree}
                    onChange={(e) => handleArrayInputChange(index, 'education', 'degree', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
                  <Input
                    id={`edu-field-${index}`}
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleArrayInputChange(index, 'education', 'fieldOfStudy', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`edu-university-${index}`}>University</Label>
                  <Input
                    id={`edu-university-${index}`}
                    value={edu.university}
                    onChange={(e) => handleArrayInputChange(index, 'education', 'university', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`edu-location-${index}`}>City and Country</Label>
                  <Input
                    id={`edu-location-${index}`}
                    value={edu.cityAndCountry}
                    onChange={(e) => handleArrayInputChange(index, 'education', 'cityAndCountry', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`edu-from-${index}`}>From</Label>
                  <Input
                    id={`edu-from-${index}`}
                    value={edu.from}
                    onChange={(e) => handleArrayInputChange(index, 'education', 'from', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`edu-to-${index}`}>To</Label>
                  <Input
                    id={`edu-to-${index}`}
                    value={edu.to}
                    onChange={(e) => handleArrayInputChange(index, 'education', 'to', e.target.value)}
                  />
                </div>
              </div>
              <Button variant="destructive" onClick={() => removeArrayItem('education', index)} className="mt-2">
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            </div>
          ))}
          <Button onClick={() => addArrayItem('education')} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Education
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.skills?.map((skill: any, index: number) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div>
                <Label htmlFor={`skill-field-${index}`}>Field</Label>
                <Input
                  id={`skill-field-${index}`}
                  value={skill.field}
                  onChange={(e) => handleArrayInputChange(index, 'skills', 'field', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`skill-entities-${index}`}>Entities (comma-separated)</Label>
                <Input
                  id={`skill-entities-${index}`}
                  value={skill.entities.join(', ')}
                  onChange={(e) => handleArrayInputChange(index, 'skills', 'entities', e.target.value.split(', '))}
                />
              </div>
              <Button variant="destructive" onClick={() => removeArrayItem('skills', index)} className="mt-2">
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            </div>
          ))}
          <Button onClick={() => addArrayItem('skills')} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Skill Group
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.experience?.map((exp: any, index: number) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`exp-position-${index}`}>Position</Label>
                  <Input
                    id={`exp-position-${index}`}
                    value={exp.position}
                    onChange={(e) => handleArrayInputChange(index, 'experience', 'position', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`exp-company-${index}`}>Company</Label>
                  <Input
                    id={`exp-company-${index}`}
                    value={exp.company}
                    onChange={(e) => handleArrayInputChange(index, 'experience', 'company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`exp-location-${index}`}>City and Country</Label>
                  <Input
                    id={`exp-location-${index}`}
                    value={exp.cityAndCountry}
                    onChange={(e) => handleArrayInputChange(index, 'experience', 'cityAndCountry', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`exp-from-${index}`}>From</Label>
                  <Input
                    id={`exp-from-${index}`}
                    value={exp.from}
                    onChange={(e) => handleArrayInputChange(index, 'experience', 'from', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`exp-to-${index}`}>To</Label>
                  <Input
                    id={`exp-to-${index}`}
                    value={exp.to}
                    onChange={(e) => handleArrayInputChange(index, 'experience', 'to', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`exp-infos-${index}`}>Information (comma-separated)</Label>
                <Textarea
                  id={`exp-infos-${index}`}
                  value={exp.infos.join(', ')}
                  onChange={(e) => handleArrayInputChange(index, 'experience', 'infos', e.target.value.split(', '))}
                />
              </div>
              <Button variant="destructive" onClick={() => removeArrayItem('experience', index)} className="mt-2">
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            </div>
          ))}
          <Button onClick={() => addArrayItem('experience')} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.projects?.map((project: any, index: number) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`project-name-${index}`}>Name</Label>
                  <Input
                    id={`project-name-${index}`}
                    value={project.name}
                    onChange={(e) => handleArrayInputChange(index, 'projects', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`project-description-${index}`}>Description</Label>
                  <Textarea
                    id={`project-description-${index}`}
                    value={project.description}
                    onChange={(e) => handleArrayInputChange(index, 'projects', 'description', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`project-image-${index}`}>Image URL</Label>
                  <Input
                    id={`project-image-${index}`}
                    value={project.image}
                    onChange={(e) => handleArrayInputChange(index, 'projects', 'image', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`project-github-${index}`}>GitHub URL</Label>
                  <Input
                    id={`project-github-${index}`}
                    value={project.github}
                    onChange={(e) => handleArrayInputChange(index, 'projects', 'github', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`project-demo-${index}`}>Demo URL</Label>
                  <Input
                    id={`project-demo-${index}`}
                    value={project.demo}
                    onChange={(e) => handleArrayInputChange(index, 'projects', 'demo', e.target.value)}
                  />
                </div>
              </div>
              <Button variant="destructive" onClick={() => removeArrayItem('projects', index)} className="mt-2">
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            </div>
          ))}
          <Button onClick={() => addArrayItem('projects')} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}