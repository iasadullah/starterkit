export interface Course {
  course_id: string
  title: string
  description: string
  category?: string
  is_published: boolean
  created_at: string
  creator_id: string
  creator_name: string
  creator_email: string
}

export interface EnrolledCourse {
  course_id: string
  title: string
  description: string
  category: string
  is_published: boolean
  enrolled_at: string
  progress: number
  status: 'enrolled' | 'completed'
  total_lessons: number
  completed_lessons: number
}
export interface CourseCreator {
  creator_id: string
  creator_name: string
  creator_email: string
}

export interface CourseListResponse {
  courses: Course[]
  total: number
  page: number
  per_page: number
}

export interface EnrolledCourseListResponse {
  courses: EnrolledCourse[]
  total: number
  page: number
  per_page: number
}
