import type { Course, EnrolledCourse } from '@/types/course-management/course'
import type { CourseDetails } from '@/types/courseListing'

export async function getEnrolledCourses(userId: string): Promise<EnrolledCourse[]> {
  const response = await fetch('/api/course-management/enrolled-courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ p_user_id: userId })
  })

  if (!response.ok) {
    throw new Error('Failed to fetch enrolled courses')
  }

  const data: EnrolledCourse[] = await response.json()

  return data
}

export async function getAllCourses(): Promise<Course[]> {
  const response = await fetch('/api/course-management/all-courses', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch all courses')
  }

  const data: Course[] = await response.json()

  return data
}

export async function enrollInCourse(userId: string, courseId: string): Promise<void> {
  const response = await fetch('/api/course-management/enroll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ p_user_id: userId, p_course_id: courseId })
  })

  if (!response.ok) {
    throw new Error('Failed to enroll in course')
  }
}

export async function getCourseDetails(courseId: string): Promise<CourseDetails> {
  const response = await fetch('/api/course-management/course-details', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ course_id: courseId })
  })

  if (!response.ok) {
    throw new Error('Failed to fetch course details')
  }

  const data: CourseDetails = await response.json()

  return data
}
