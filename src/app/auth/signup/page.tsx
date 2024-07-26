"use client"
import Card from '@/components/card'
import React from 'react'
import { useRouter } from 'next/navigation'
import { handleSignup } from '@/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { toast, ToastContainer } from 'react-toastify';

const signUpSchema = z.object({
  email: z.string().email({
    message: "Invalid email format"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long"
  }),
  confirmPassword: z.string().min(1, {
    message: "Please confirm your password"
  }),
  firstName: z.string().min(1, {
    message: "Please enter a name"
  }),
  lastName: z.string().min(1, {
    message: "Please enter a last name"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function SigninPage() {

  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password:""
    }
  })

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    try {
      const { firstName, lastName, email, password } = data
      const newUser = await handleSignup({ firstName, lastName, email, password })
      if (newUser) {
        toast.success("Account Created!", {
          position: "top-center"
        });
        router.push('/auth/signin')
      }
    } catch(error) {
      console.error(error)
    }
  }
  return (
    <div className='flex justify-center items-center h-screen'>
      <Card className="w-[300px]">
        <h1>Log in</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='firstName'
              render={({field})=> (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
            )}/>
            <FormField
              control={form.control}
              name='lastName'
              render={({field})=> (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
            )}/>
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
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({field})=> (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='' {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
            )}/>
            <Button className='mt-4 w-full' type='submit'>Log in</Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}
