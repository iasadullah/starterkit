export interface Course {
  course_id: string
  title: string
  description: string
  is_published: boolean
  created_at: string
  creator_name: string
}

export interface CourseDetails extends Course {
  is_enrolled: boolean
  modules: Module[]
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  is_published: boolean
}

export interface Users {
  role_name: string
  id: string
  user_id: string
  role_id: string
  name: string
  email: string
}
