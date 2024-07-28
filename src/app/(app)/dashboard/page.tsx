"use client"
import React from 'react'
import { useUser } from '@/hooks/useUser'
import Card from '@/components/card'
import { IoIosAddCircle } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";
import Link from 'next/link';
export default function page() {
  const { user, loading } = useUser()

  return (
    <div>
      <section>
        <div>
          <p className='text-sm'>Dashboard</p>
          <h1 className='font-bold text-lg mt-8'>Welcome, {user?.firstName}</h1>
          <h2 className='text-slate-500'>What do you want to do today?</h2>
        </div>
        <div className='mt-20 flex flex-col md:flex-row gap-12'>
          <Card className='w-full md:w-[200px] '>
            <Link href='/client/new' className='flex flex-col gap-4 items-center'>
              <IoIosAddCircle className='text-primary text-[50px]'/>
              <p className='font-bold'>Add Client</p>
            </Link>
          </Card>
          <Card className='w-full md:w-[200px] flex flex-col gap-4 items-center'>
            <Link href='/client' className='flex flex-col gap-4 items-center'>
              <FaUser className='text-primary text-[50px]'/>
              <p className='font-bold'>Clients</p>
            </Link>
          </Card>
          <Card className='w-full md:w-[200px] flex flex-col gap-4 items-center'>
            <RiPlantFill className='text-primary text-[50px]'/>
            <p className='font-bold'>Services</p>
          </Card>
          <Card className='w-full md:w-[200px] flex flex-col gap-4 items-center'>
            <Link href='/service/new' className='flex flex-col gap-4 items-center'>
              <IoIosAddCircle className='text-primary text-[50px]'/>
              <p className='font-bold'>Add Service</p>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  )
}
