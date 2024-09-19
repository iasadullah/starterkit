import { Users } from '@/types/courseListing'

export const updateUserRole = async (userId: string, newRoleId: nubmer) => {
  try {
    const response = await fetch(`/api/Users/change-role?user_id=${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id: newRoleId }) // Pass the new role_id
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
