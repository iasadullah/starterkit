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

export interface Module {
  id: string
  title: string
  description: string
  position: number
  lessons: Lesson[]
}

export interface Lesson {
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

export interface MediaItem {
  id: string
  url: string
  type: string
  file_extension: string
}

export interface Quiz {
  id: string
  title: string
  max_attempts: number
  is_completed: boolean
  questions: Question[]
}

export interface Question {
  id: string
  type: 'multiple_choice' | 'true_false' | 'essay'
  question_text: string
  options: Option[]
  correct_answer: string | null
}

// export interface Quiz_lesson {
//   id: string
//   title: string
//   is_timed: boolean
//   duration: number | null
//   max_attempts: number
//   questions: Question[]
// }

// export interface Question_lesson {
//   id: string
//   question_text: string
//   type: 'multiple_choice' | 'true_false' | 'essay'
//   options: { id: string; text: string }[]
// }
export interface Option {
  id: string
  text: string
  is_correct: boolean
}

/**StartLesson */

export interface StartLessonResponse {
  success: boolean
  message: string
  status: 'started' | 'in_progress'
  progress: number
}

/**CourseProgress */
export interface CourseProgress {
  enrollment_id: string
  course_id: string
  user_id: string
  overall_progress: number
  enrolled_at: string
  completion_date: string | null
  status: string
  lesson_progress: {
    lesson_id: string
    progress: number
    is_completed: boolean
  }[]
}

////
export type Question_lesson = {
  id: string
  question_text: string
  type: 'multiple_choice' | 'true_false' | 'essay'
  options?: {
    id: string
    text: string
  }[]
  correct_answer?: string | null
}

export type Quiz_lesson = {
  id: string
  title: string
  is_timed: boolean
  duration: number | null
  max_attempts: number
  question_count: number
  attempts_taken: number
  question_types: string[]
  questions: Question_lesson[] // This will be empty initially
}

export interface QuizAttemptResponse {
  success: boolean
  attempt_id: string
  questions: Question_lesson[]
  message?: string
}

export interface QuizProgress {
  success: boolean
  attempt_id: string
  quiz_id: string
  started_at: string
  completed_at: string | null
  score: number | null
  answers: Record<string, { answer: any; is_correct: boolean | null }>
}

export interface QuizSubmissionResponse {
  success: boolean
  score: number
  total_questions: number
  message?: string
}
