import { Users } from '@/types/courseListing'

export async function getAllUsers(): Promise<Users[]> {
  const response = await fetch('/api/Users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch all users')
  }

  const data: Users[] = await response.json()

  return data
}
