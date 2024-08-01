"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getClientById } from '@/services/clientService'
import { toast } from 'react-toastify'
import { ClientType, ServiceType } from '@/types/types'
import { useUser } from '@/hooks/useUser'
import { MdEdit, MdDelete } from "react-icons/md";
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import formatDate from '@/lib/dateUtil'
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Card from '@/components/card'
import { getServicesByClientId } from '@/services/serviceService'

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

export default function Client() {
  const param = useParams()
  const [client, setClient] = useState<ClientType | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [services, setServices] = useState<ServiceType[]>([])
  const [totalServices, setTotalServices] = useState(0)
  const [date, setDate] = useState<Date>()

  const { user, loading } = useUser()

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
    const clientId: string = Array.isArray(param.id) ? param.id[0] : param.id;
    const fetchClient = async () => {
      try {
        if (!param.id) {
          console.log('id is required')
          return
        }
        const response = await getClientById(clientId)
        setClient(response)
        form.reset({
          fullName: response.fullName,
          address: response.address,
          email: response.email,
          phone: response.phone,
          userId: response.userId,
        })
      } catch(error) {
        console.log(error)
        toast.error("Something went wrong")
      }
    }

    const fetchServices = async () => {
      // fetch services by client id
      try {
        if (!param.id) {
          console.log('id is required')
          return
        }
        const response = await getServicesByClientId(clientId)
        setServices(response.services)
        setTotalServices(response.totalServices)
      } catch(error) {
        console.log(error)
        toast.error("Something went wrong")
      }
    }

    fetchClient()
    fetchServices()
  },[])

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
        toast.success("Client added successfully")
      }
    } catch {
      console.log("error")
    }
  }

  async function createService(values: z.infer<typeof serviceSchema>) {
    try {
      const response = await fetch("/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...values,
          total: parseFloat(values.total),
          deposit: parseFloat(values.deposit),
          clientId: client?.id
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
            <BreadcrumbPage>{client?.fullName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className='mt-8'>
        <div className='flex justify-between'>
          <h1 className='text-lg font-bold'>{client?.fullName}</h1>
          <div className='flex gap-4'>
            <button onClick={()=>setEditMode(true)} className='bg-secondary p-3 rounded-full'><MdEdit className='text-white cursor-pointer'/></button>
            <button className='bg-secondary p-3 rounded-full'><MdDelete className='text-white cursor-pointer'/></button>
          </div>
        </div>
        <Card className="mt-8 w-full">
          <h2 className='text-sm font-semibold'>Client Info</h2>
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
                            <Input disabled={!editMode} className='w-full md:w-[400px]' placeholder='Full Name' {...field}/>
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
                            <Input disabled={!editMode} placeholder='Address' className='w-full md:w-[400px]' {...field}/>
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
                            <Input disabled={!editMode} type='email' className='w-full md:w-[400px]' placeholder='Email' {...field}/>
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
                            <Input disabled={!editMode} type='type' className='w-full md:w-[400px]' placeholder='Phone Number' {...field}/>
                          </FormControl>
                          <FormMessage/>

                      </FormItem>
                    )}
                  />
                </div>
                {editMode && (
                  <div className='flex gap-4 mt-8'>
                  <Button type='submit' className="px-8">Edit Client</Button>
                  <Button variant="outline" onClick={()=>setEditMode(false)} className="px-8">Cancel</Button>
                  </div>)
                }
              </form>
            </Form>
          </section>
        </Card>
      </section>
      <section className='flex mt-8 gap-4 w-full'>
        <Card className="w-full">
          <div className='flex justify-between'>
            <h3 className='text-sm font-semibold'>Services</h3>
            <Popover>
              <PopoverTrigger className='underline text-primary text-sm'>+ Add Service</PopoverTrigger>
              <PopoverContent>
                <h1>Add new service to {client?.fullName}</h1>
                <Form {...form}>
                  <form onSubmit={formService.handleSubmit(createService)}>
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
                      <Button type='submit'>Create Service</Button>
                    </div>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
          </div>
          <Table className='mt-8'>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Service</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Deposit</TableHead>
                <TableHead className="font-bold">Due Amount</TableHead>
                <TableHead className="font-bold text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => {
                return (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{formatDate(service.date)}</TableCell>
                    <TableCell>$ {service.deposit}</TableCell>
                    <TableCell>$ {service.total - service.deposit}</TableCell>
                    <TableCell className="text-right">$ {service.total}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell className="text-right">${totalServices}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

        </Card>
      </section>
    </div>
  )
}
