import { ClientType } from '@/types/types';

export async function createClient(data: ClientType) {
    const res = await fetch(`/api/service`, {
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

export async function getServicesByClientId(clientId: string) {
    const res = await fetch(`/api/service?clientId=${clientId}`)

    if(res.ok){
        const result = await res.json()
        return result
    }
    else{
        throw new Error(await res.text())
    }
}

export async function getServiceById(id: string) {
  const res = await fetch(`/api/service/${id}`)

  if(res.ok){
      const result = await res.json()
      return result
  }
  else{
      throw new Error(await res.text())
  }
}

export async function deleteService(id: string) {
  const res = await fetch(`/api/service/${id}`, {
    method: 'DELETE'
  })

  if(res.ok){
      const result = await res.json()
      return result
  }
  else{
      throw new Error(await res.text())
  }
}