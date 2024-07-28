"use client"
import React, { useState, useEffect } from 'react'
import Card from '@/components/card'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { ClientType } from '@/types/types'
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
import { getClientsByUserId } from '@/services/clientService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'

const serviceSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a service"
  }),
  date: z.date(),
  total: z.string().refine((val) => !isNaN(parseFloat(val)) && isFinite(Number(val)), {
    message: "Please enter a valid number"
  }),
  deposit: z.string().refine((val) => !isNaN(parseFloat(val)) && isFinite(Number(val)), {
    message: "Please enter a valid number"
  }),
  clientId: z.string()
})

export default function page() {
  const { user, loading } = useUser()

  const [date, setDate] = useState<Date>()
  const [clients, setClients] = useState<ClientType[]>([])

  useEffect(() => {
    const fetchClients = async () => {
      if (user) {
        try {
          const response = await getClientsByUserId(user.id)
          if (response.length > 0) {
            setClients(response)
          }
        } catch(error) {
          console.log(error)
        }
      }
    }
    fetchClients()
  }, [user])

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      total: "",
      deposit: "",
      clientId: ""
    }
  })

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    try {
      const response = await fetch("/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...values,
          total: parseFloat(values.total),
          deposit: parseFloat(values.deposit)
        })
      })
      
      if (response.status === 201) {
        toast.success("Service added successfully")
      }
    } catch {
      console.log("error")
    }
  }

  return (
    <div>
      <div>
        <h1 className='font-bold text-lg mt-8'>Add New Service</h1>
      </div>
      <section className='mt-8'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col md:flex-row gap-4 mt-4'>
              <FormField
                control={form.control}
                name="name"
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
                            <SelectItem value="snow removal">Snow Removal</SelectItem>
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
                name="clientId"
                render={({field})=> (
                  <FormItem>
                    <FormLabel></FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className='w-full md:w-[400px]'>
                            <SelectValue placeholder="Select Client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients?.map((client) => (
                              <SelectItem key={client.id} value={client.id}>{client.fullName}</SelectItem>
                            ))}
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
            <div className='flex flex-col md:flex-row gap-4 mt-4'>
              
            </div>
            <div className='flex mt-8'>
              <Button type='submit' className="px-8">Add Service</Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  )
}
