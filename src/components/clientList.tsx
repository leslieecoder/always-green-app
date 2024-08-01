"use client"
import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from '@/hooks/useUser'
import { getClientsByUserId } from '@/services/clientService'
import { ClientType } from '@/types/types'
import { IoMdSearch } from "react-icons/io";

export default function ClientList() {
  const [clients, setClients] = useState<ClientType[]>([])
  const [filteredClients, setFilteredClients] = useState<ClientType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { user, loading } = useUser()

  useEffect(() => {
    const fetchClients = async () => {
      if (user) {
        try {
          const response = await getClientsByUserId(user.id)
          if (response.length > 0) {
            setClients(response)
            setFilteredClients(response)
          }
        } catch(error) {
          console.log(error)
        }
      }
    }

    fetchClients()
  }, [user])

  const handleSearch = () => {
    const filtered = clients.filter(client =>
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    )
    setFilteredClients(filtered)
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full">
        <Input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-full rounded-none rounded-l-lg"
        />
        <Button onClick={handleSearch} className='bg-secondary rounded-none rounded-r-lg'><IoMdSearch /></Button>
      </div>

      <Table className='client-list'>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Address</TableHead>
            <TableHead className="font-bold">Email</TableHead>
            <TableHead className="font-bold">Phone number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                <a className='underline' href={`/client/${client.id}`}>{client.fullName}</a>
              </TableCell>
              <TableCell>{client.address}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}