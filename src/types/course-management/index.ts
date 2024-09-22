export interface CourseStructure {
  course_id: string
  course_title: string
  course_description: string
  category: string
  created_at: string
  updated_at: string
  is_published: boolean
  modules: Module[]
}

interface Module {
  id: string
  title: string
  description: string
  position: number
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  content: string
  position: number
  is_completed: boolean
  progress: number
  is_published: boolean
  is_prerequisite: boolean
  media_items: MediaItem[]
  quizzes: Quiz[]
}

interface MediaItem {
  id: string
  url: string
  type: string
  file_extension: string
}

interface Quiz {
  id: string
  title: string
  max_attempts: number
  is_completed: boolean
  questions: Question[]
}

interface Question {
  id: string
  type: string
  question_text: string
  options: Option[]
  correct_answer: string | null
}

interface Option {
  id: string
  text: string
  is_correct: boolean
}
