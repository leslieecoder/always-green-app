"use client"
import React, { useState } from 'react'
import Logo from "../../public/full-logo.png"
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import Image from 'next/image'
import Link from 'next/link';

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className='h-auto md:h-screen w-full md:w-[300px] bg-primary'>
      <div className='flex justify-between items-center p-4'>
        <Image className='md:mx-auto w-[100px] md:w-[200px]' src={Logo} alt='logo' width={200} height={200}/>
        <div className='block md:hidden'>
          <HiOutlineMenuAlt3 
            className='text-white text-[30px] cursor-pointer'
            onClick={toggleMenu}
          />
        </div>
      </div>
      
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <ul className='flex flex-col w-full items-center text-white mt-4 md:mt-16'>
          <Link href="/dashboard" className='p-3 hover:bg-secondary hover:text-primary cursor-pointer w-full text-center'>Dashboard</Link>
          <Link href="/client" className='p-3 hover:bg-secondary hover:text-primary cursor-pointer w-full text-center'>Clients</Link>
          <Link href="" className='p-3 hover:bg-secondary hover:text-primary cursor-pointer w-full text-center'>Settings</Link>
        </ul>
      </div>
    </nav>
  )
}