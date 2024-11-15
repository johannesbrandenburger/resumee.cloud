'use client'

interface Base64ImageViewerProps {
  value: string
}

export function Base64ImageViewer({ value }: Base64ImageViewerProps) {
  if (!value || value === '') {
    return (
      null
    )
  }

  return (
    <img src={value} alt="Base64 encoded" className="max-w-full h-auto rounded-md" />
  )
}