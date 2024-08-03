"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ClientType, ServiceType } from '@/types/types'
import { useUser } from '@/hooks/useUser'
import { MdEdit, MdDelete } from "react-icons/md";
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { format, set } from "date-fns"
import formatDate from '@/lib/dateUtil'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
import Card from '@/components/card'
import { getServiceById } from '@/services/serviceService'

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

export default function Service() {
  const [service, setService] = useState<ServiceType[]>([])
  const [date, setDate] = useState<Date>()

  const router = useRouter()
  const param = useParams()

  const formService = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      total: "",
      deposit: "",
      clientId: ""
    }
  })

  useEffect(() => {
    const serviceId: string = Array.isArray(param.id) ? param.id[0] : param.id;

    const fetchService = async () => {
      try {
        if (!param.id) {
          console.log('id is required')
          return
        }
        const response = await getServiceById(serviceId)
        console.log(response)
        formService.reset({
          name: response.services.name,
          date: new Date(response.services.date),
          total: response.services.total,
          deposit: response.services.deposit,
        })
      } catch(error) {
        console.log(error)
        toast.error("Something went wrong")
      }
    }

    fetchService()
  },[])

  const editService = async (data: z.infer<typeof serviceSchema>) => {
    try {
      await fetch(`/api/service/${param.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      toast.success("Service updated")
      router.push('/service')
    } catch(error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <div>
    <Card className="mt-8 w-full">
      <h1>Edit service</h1>
      <Form {...formService}>
        <form onSubmit={formService.handleSubmit(editService)}>
          <div className='flex flex-col gap-4 mt-4'>
            <FormField
              control={formService.control}
              name="name"
              render={({field})=> (
                <FormItem>
                  <FormLabel></FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className='w-full'>
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
              control={formService.control}
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
                            "w-full justify-start text-left font-normal",
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
          <div className='flex flex-col gap-4 mt-4'>
            <FormField
              control={formService.control}
              name="total"
              render={({field})=> (
                <FormItem>
                  <FormLabel></FormLabel>
                    <FormControl>
                      <Input className='w-full' placeholder='Total Price' {...field}/>
                    </FormControl>
                    <FormMessage/>

                </FormItem>
              )}
            />
            <FormField
              control={formService.control}
              name="deposit"
              render={({field})=> (
                <FormItem>
                  <FormLabel></FormLabel>
                    <FormControl>
                      <Input className='w-full' placeholder='Deposit' {...field}/>
                    </FormControl>
                    <FormMessage/>

                </FormItem>
              )}
            />
          
          </div>
          <div className='flex flex-col md:flex-row gap-4 mt-4'>
            
          </div>
          <div className='flex flex-row !p-0'>
            <Button type='submit'>Update Service</Button>
          </div>
        </form>
      </Form>

    </Card>
    </div>
  )
}
