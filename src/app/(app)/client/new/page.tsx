"use client"
import React, { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
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
import { toast } from 'react-toastify'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const clientSchema = z.object({
  fullName: z.string().min(1, {
    message: "Please enter a name"
  }),
  address: z.string().min(1, {
    message: "Please enter an address"
  }),
  email: z.string().email({
    message: "Invalid email format"
  }),
  phone: z.string().min(1, {
    message: "Please enter a phone number"
  }),
  userId: z.string(),
})

export default function NewClientPage() {
  const { user, loading } = useUser()

  const router = useRouter()
  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      phone: "",
      userId: ""
    }
  })

  async function onSubmit(values: z.infer<typeof clientSchema>) {
    try {
      const response = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...values,
          userId:user?.id,
        })
      })
      console.log(response)
      if (response.status === 400) {
        toast.error("Email already exists")
      }
      if (response.status === 201) {
        toast.success("Client added successfully")
        router.push("/client")
      }
     
    } catch {
      console.log("error")
    }
  }

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Client</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className='font-bold text-lg mt-8'>Add New Client</h1>
      </div>
      <section className='mt-8'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col md:flex-row gap-4 w-full'>
              <FormField
                control={form.control}
                name="fullName"
                render={({field})=> (
                  <FormItem>
                    <FormLabel></FormLabel>
                      <FormControl>
                        <Input className='w-full md:w-[400px]' placeholder='Full Name' {...field}/>
                      </FormControl>
                      <FormMessage/>

                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({field})=> (
                  <FormItem>
                    <FormLabel></FormLabel>
                      <FormControl>
                        <Input placeholder='Address' className='w-full md:w-[400px]' {...field}/>
                      </FormControl>
                      <FormMessage/>

                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col md:flex-row gap-4 mt-4'>
              <FormField
                control={form.control}
                name="email"
                render={({field})=> (
                  <FormItem>
                    <FormLabel></FormLabel>
                      <FormControl>
                        <Input type='email' className='w-full md:w-[400px]' placeholder='Email' {...field}/>
                      </FormControl>
                      <FormMessage/>

                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({field})=> (
                  <FormItem>
                    <FormLabel></FormLabel>
                      <FormControl>
                        <Input type='type' className='w-full md:w-[400px]' placeholder='Phone Number' {...field}/>
                      </FormControl>
                      <FormMessage/>

                  </FormItem>
                )}
              />
            </div>
            <div className='flex mt-8'>
              <Button type='submit' className="px-8">Add Client</Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  )
}
