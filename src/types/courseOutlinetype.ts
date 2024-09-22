export interface CourseOutlineResponse {
  status: string
  courses: Course[]
  message: string
}

interface Course {
  id: string
  tags: string[]
  title: string
  modules: Module[]
  is_draft: boolean
  created_at: string
  updated_at: string
  description: string
  learning_objectives: LearningObjective[]
}

interface Module {
  id: string
  quiz: Quiz
  title: string
  lessons: Lesson[]
  assignment: Assignment
  description: string
  order_index: number
}

interface Quiz {
  id: string
  title: string
  question_count: number
}

interface Lesson {
  id: string
  title: string
  topics: Topic[]
  order_index: number
}

interface Topic {
  id: string
  title: string
  order_index: number
}

interface Assignment {
  id: string
  title: string
  description: string
}

interface LearningObjective {
  objective: string
  order_index: number
}
