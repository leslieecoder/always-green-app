import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
interface CardProps {
  children: ReactNode,
  className?: String
}

export default function Card({children, className}: CardProps) {
  return (
    <div className={cn("p-5 w-fit shadow border rounded-md", className)}>
      {children}
    </div>
  )
}
