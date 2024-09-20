import { Users } from '@/types/courseListing'

export async function firstTimeLoginCheck(userId: string): Promise<Users[]> {
  const response = await fetch(`/api/Auth/login/first-time-login-check?id=${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch all users')
  }

  const data: Users[] = await response.json()

  return data
}
