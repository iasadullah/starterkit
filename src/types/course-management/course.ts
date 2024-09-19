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
export interface CourseDetails {
  id: string
  title: string
  description: string
  category: string
  created_at: string
  created_by: string
  updated_at: string
  is_published: boolean
  modules: ModuleDetails[]
}

export interface ModuleDetails {
  id: string
  title: string
  description: string
  position: number
  lessons: LessonDetails[]
}

export interface LessonDetails {
  id: string
  title: string
  content: string
  position: number
  is_published: boolean
  is_prerequisite: boolean
  quizzes: QuizDetails[]
  media_items: MediaItem[]
}

export interface QuizDetails {
  id: string
  title: string
  questions: QuestionDetails[]
  max_attempts: number
}

export interface QuestionDetails {
  id: string
  type: string
  question_text: string
  options: OptionDetails[]
  correct_answer: string | null
}

export interface OptionDetails {
  id: string
  text: string
  is_correct: boolean
}

export interface MediaItem {
  id: string
  url: string
  type: string
}
