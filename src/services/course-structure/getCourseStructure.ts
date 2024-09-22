import type { CourseStructure } from '@/types/course-structure'

export async function getCourseStructure(courseId: string): Promise<CourseStructure | null> {
  try {
    const response = await fetch('/api/course-management/course-structure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courseId })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch course structure')
    }

    const data = await response.json()

    return data as CourseStructure
  } catch (error) {
    console.error('Error fetching course structure:', error)

    return null
  }
}
