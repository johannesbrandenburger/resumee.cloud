'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from "~/app/_components/ui/input"
import { Button } from "~/app/_components/ui/button"
import { X, Plus } from 'lucide-react'

interface StringListInputProps {
  value: string[]
  onChange: (newValue: string[]) => void
}

export default function StringListInput({ value = [], onChange }: StringListInputProps) {
  const [items, setItems] = useState<string[]>(value)

  const updateItems = useCallback((newItems: string[]) => {
    setItems(newItems)
    onChange(newItems)
  }, [onChange])

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(items)) {
      setItems(value)
    }
  }, [value])

  const handleChange = (index: number, newValue: string) => {
    const newItems = [...items]
    newItems[index] = newValue
    updateItems(newItems)
  }

  const handleAdd = () => {
    updateItems([...items, ''])
  }

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    updateItems(newItems)
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`Item ${index + 1}`}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              handleRemove(index)
            }}
            aria-label={`Remove item ${index + 1}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={handleAdd} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Item
      </Button>
    </div>
  )
}