"use client"
import React, { useState } from 'react'
import Card from '@/components/card'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createClient } from '@/services/clientService'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link'
import  {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'

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
  total: z.string().refine((val) => !isNaN(parseFloat(val)) && isFinite(Number(val)), {
    message: "Please enter a valid number"
  }),
  deposit: z.string().refine((val) => !isNaN(parseFloat(val)) && isFinite(Number(val)), {
    message: "Please enter a valid number"
  }),
  service: z.string().min(1, {
    message: "Please enter a service"
  }),
  userId: z.string(),
  date: z.date()
})

export default function page() {
  const { user, loading } = useUser()

  const [date, setDate] = useState<Date>()

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      phone: "",
      service: "",
      total: "",
      deposit: "",
      date: new Date(),
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
      
      if (response.status === 201) {
        toast.success("Transaction added successfully")
      }
    } catch {
      console.log("error")
    }
  }

  return (
    <div>
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
            <div className='flex flex-col md:flex-row gap-4 mt-4'>
              <FormField
                control={form.control}
                name="service"
                render={({field})=> (
                  <FormItem>
                    <FormLabel></FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className='w-full md:w-[400px]'>
                            <SelectValue placeholder="Service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pruning">Pruning</SelectItem>
                            <SelectItem value="snow_removal">Snow Removal</SelectItem>
                            <SelectItem value="maintance">Maintance</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage/>

                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({field})=> (
                  <FormItem>
                    <FormLabel></FormLabel>
                      <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full md:w-[400px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            className="text-backgroundDark dark:!text-white bg"
                            selected={field.value}
                            onSelect={(date)=> {
                              field.onChange(date)
                              setDate(date)
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      </FormControl>
                      <FormMessage/>

                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col md:flex-row gap-4 mt-4'>
              <FormField
                control={form.control}
                name="total"
                render={({field})=> (
                  <FormItem>
                    <FormLabel></FormLabel>
                      <FormControl>
                        <Input className='w-full md:w-[400px]' placeholder='Total Price' {...field}/>
                      </FormControl>
                      <FormMessage/>

                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deposit"
                render={({field})=> (
                  <FormItem>
                    <FormLabel></FormLabel>
                      <FormControl>
                        <Input className='w-full md:w-[400px]' placeholder='Deposit' {...field}/>
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
