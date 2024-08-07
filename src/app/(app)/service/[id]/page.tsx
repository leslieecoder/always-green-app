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
import { getServiceById, deleteService } from '@/services/serviceService'

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
})

export default function Service() {
  const [service, setService] = useState<ServiceType | undefined>(undefined)
  const [date, setDate] = useState<Date>()

  const router = useRouter()
  const param = useParams()

  const { user, loading } = useUser()

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      total: "",
      deposit: "",
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

        setService(response.services[0])
        form.reset({
          name: response.services[0].name,
          date: new Date(response.services[0].date),
          total: response.services[0].total.toString(),
          deposit: response.services[0].deposit.toString(),
        })
      } catch(error) {
        console.log(error)
        toast.error("Something went wrong")
      }
    }

    fetchService()
  },[])

  async function onSubmit(data: z.infer<typeof serviceSchema>) {
    console.log("here")
    try {
      await fetch(`/api/service/${param.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          clientId: service?.clientId,
          total: parseFloat(data.total),
          deposit: parseFloat(data.deposit)
        })
      })
      toast.success("Service updated")
      router.push(`/client/${service?.clientId}`)
    } catch(error) {
      console.log(error)
      toast.error("Something went wrong")
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
            <BreadcrumbLink href="/client">Clients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/client/${service?.clientId}`}>Client</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit service</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className='mt-8 font-bold text-lg'>Edit service</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col md:flex-row gap-4 mt-4'>
            <FormField
              control={form.control}
              name="name"
              render={({field})=> (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange} >
                        <SelectTrigger className='w-full md:w-[400px]'>
                          <SelectValue placeholder={`${field.value}`}/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pruning">Pruning</SelectItem>
                          <SelectItem value="snow removal">Snow Removal</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="garden block 4 horas">Garden block 4 horas</SelectItem>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="fabric">Fabric</SelectItem>
                          <SelectItem value="plantas">Plantas</SelectItem>
                          <SelectItem value="árboles">Árboles</SelectItem>
                          <SelectItem value="irrigation">Irrigation</SelectItem>
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
                  <FormLabel>Date</FormLabel>
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
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          className="text-backgroundDark dark:!text-white bg"
                          selected={new Date(field.value)}
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
                  <FormLabel>Total price</FormLabel>
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
                  <FormLabel>Deposit</FormLabel>
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
          <div className='flex flex-row mt-8 !p-0'>
            <Button type='submit'>Update Service</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
