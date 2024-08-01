"use client"
import Card from '@/components/card'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import  {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'



const signInSchema = z.object({
  email: z.string().email({
    message: "Invalid email format"
  }),
  password: z.string().min(1, {
    message: "Please enter a password"
  })
})

export default function SigninPage() {

  const router = useRouter()
  const [error, setError] = useState<string | undefined>(undefined)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password:""
    }
  })
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const { email, password } = data
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      const result = await response.json()
      setError(undefined)
      if (result.status === 200) {
        router.push('/dashboard')
      } else {
        setError(result.message)
      }
    } catch (error) {
      toast.error("Error logging in")
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <Card className="w-[300px]">
        <h1 className='mb-8 text-primary font-bold'>Log in</h1>
        {error && <div className='bg-red-50 p-3 text-sm rounded-sm border text-red-600 border-red-400'>{error}</div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='mt-4'>
              <FormField
                control={form.control}
                name='email'
                render={({field})=> (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='example@mail.com' {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
            </div>
            <div className='mt-8'>
              <FormField
                control={form.control}
                name='password'
                render={({field})=> (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='' {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}/>
            </div>
            <Button className='mt-4 w-full' type='submit'>Log in</Button>
          </form>
        </Form>
        <Link className='text-center block text-sm mt-5 underline text-primary' href='/auth/signup'>
          Don&apos;t have an account? Sign up
        </Link>
      </Card>
    </div>
  )
}
