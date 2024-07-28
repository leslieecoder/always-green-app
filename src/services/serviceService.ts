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