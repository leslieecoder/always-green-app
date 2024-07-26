"use client"
import React, { useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
export default function page() {
  const { user, loading } = useUser()
  useEffect(() => {
    console.log(user)
  }
  , [user])
  return (
    <div>page</div>
  )
}
