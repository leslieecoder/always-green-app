import ClientList from '@/components/clientList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { IoPersonAdd } from "react-icons/io5";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function page() {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Clients</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex justify-between mt-8 align-bottom'>
        <h1 className='font-bold text-lg'>Clients List</h1>
        <div>
          <Button className='bg-primary flex gap-3 items-center'>
            <IoPersonAdd />
            <Link href='/client/new'>Add New Client</Link>
          </Button>
        </div>
      </div>
      <section className='mt-8'>
        
        <div className='mt-20'>
          <ClientList />
        </div>
      </section>
    </div>
  )
}
