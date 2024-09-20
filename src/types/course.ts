export interface Course {
  id: string
  title: string
  description: string
  category: string
  is_published: boolean
  created_by: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description: string
  position: number
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  content: string
  position: number
  is_prerequisite: boolean
  is_published: boolean
}

export interface MediaItem {
  id: string
  lesson_id: string
  type: string
  url: string
  name: string
}

export interface Quiz {
  id: string
  lesson_id: string
  title: string
  max_attempts: number
}

export interface Question {
  id: string
  quiz_id: string
  type: 'multiple_choice' | 'true_false' | 'essay'
  question_text: string
  options: Option[]
  correct_answer: string | null
}

export interface Option {
  id: string
  text: string
  is_correct: boolean
}
