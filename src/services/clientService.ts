import { ClientType } from '@/types/types';

export async function createClient(data: ClientType) {
    const res = await fetch(`/api/client`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if(res.ok){
        return await res.json()
    }
    else{
        throw new Error(await res.text())
    }
}

export async function getClientsByUserId(userId: string) {
    const res = await fetch(`/api/client?userId=${userId}`)

    if(res.ok){
        const result = await res.json()
        return result
    }
    else{
        throw new Error(await res.text())
    }
}

export async function getClientById(id: string) {
  const res = await fetch(`/api/client/${id}`)

  if(res.ok){
      const result = await res.json()
      return result
  }
  else{
      throw new Error(await res.text())
  }
}