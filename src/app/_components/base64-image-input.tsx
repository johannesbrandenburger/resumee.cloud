'use client'

import { useState, useRef } from 'react'
import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Label } from "~/app/_components/ui/label"

interface Base64ImageInputProps {
  value: string
  onChange: (base64: string) => void
  maxFileSizeMB?: number
}

export function Base64ImageInput({ value, onChange, maxFileSizeMB }: Base64ImageInputProps) {
  const [fileName, setFileName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxFileSize = maxFileSizeMB || 3

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsLoading(true)
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        
        // set a filesize limit
        if (file.size > maxFileSize * 1024 * 1024) {
          alert("File size is too large. Please upload a file smaller than 3MB.")
          setIsLoading(false)
          return
        }
        const base64 = e.target?.result as string
        onChange(base64)
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="">
      <div className="flex items-center">
        <Input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button onClick={handleButtonClick} variant="outline" className="mr-2">
          {isLoading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  )
}