"use client"
import React, { useState, useEffect} from 'react'
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
import { useUser } from '@/hooks/useUser'
import { getClientsByUserId } from '@/services/clientService'
import { ClientType } from '@/types/types'
export default function ClientList() {
  const [clients, setClients] = useState<ClientType[]>([])
  const { user, loading } = useUser()

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

  return (
    <Table className='border'>
      <TableHeader>
        <TableRow>
          <TableHead className="">Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Phone number</TableHead>
          <TableHead className="text-right">Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients?.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.fullName}</TableCell>
            <TableCell>{client.address}</TableCell>
            <TableCell className="text-right">{client.phone}</TableCell>
            <TableCell>{client.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
