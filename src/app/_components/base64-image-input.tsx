'use client'

import { useState, useRef } from 'react'
import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Label } from "~/app/_components/ui/label"

interface Base64ImageInputProps {
  value: string
  onChange: (base64: string) => void
}

export function Base64ImageInput({ value, onChange }: Base64ImageInputProps) {
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        onChange(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">Upload Image</Label>
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button onClick={handleButtonClick} variant="outline">
          Choose File
        </Button>
        <span className="text-sm text-gray-500">
          {fileName || 'No file chosen'}
        </span>
      </div>
    </div>
  )
}