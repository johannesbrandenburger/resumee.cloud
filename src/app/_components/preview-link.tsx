"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import * as HoverCard from '@radix-ui/react-hover-card'
import { ExternalLink } from 'lucide-react'

interface PreviewLinkProps {
  href: string
  children: React.ReactNode
}

export function PreviewLinkComponent({ href, children }: PreviewLinkProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <HoverCard.Root openDelay={200} closeDelay={300}>
      <HoverCard.Trigger asChild>
        <Link 
          href={href} 
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200 inline-flex items-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content 
          className="z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-[480px] h-[320px]"
          sideOffset={5}
        >
          <div className="relative w-full h-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <iframe
              src={href}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              title={`Preview of ${href}`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <HoverCard.Arrow className="fill-white" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}