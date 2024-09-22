import { Users } from '@/types/courseListing'

export const updateUserRole = async (userId: string, newRoleId: any) => {
  try {
    const response = await fetch(`/api/Users/change-role?user_id=${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: newRoleId })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch all users')
    }

    const data: Users[] = await response.json()

    return data
  } catch (error) {
    throw new Error('Failed to fetch all users')
  }
}
