import ClientList from '@/components/clientList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { IoPersonAdd } from "react-icons/io5";

export default function page() {
  return (
    <div>
      <div>
        <h1 className='font-bold text-lg mt-8'>Clients List</h1>
      </div>
      <section className='mt-8'>
        <div className='flex justify-end'>
          <Button className='bg-primary flex gap-3 items-center'>
            <IoPersonAdd />
            <Link href='/client/new'>Add New Client</Link>
          </Button>
        </div>
        <div className='mt-8'>
          <ClientList />
        </div>
      </section>
    </div>
  )
}
