import type {
  CourseProgress,
  CourseStructure,
  Question_lesson,
  Quiz_lesson,
  StartLessonResponse
} from '@/types/enrolled-course/course-structure'

interface QuizResponse {
  id: string
  title: string
  is_timed: boolean
  duration: number | null
  max_attempts: number
  question_count: number
  attempts_taken: number
  question_types: string[]
}

export async function getCourseStructure(courseId: string): Promise<CourseStructure> {
  const response = await fetch('/api/course-management/structure', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ courseId })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function startLesson(userId: string, lessonId: string): Promise<StartLessonResponse> {
  const response = await fetch('/api/course-management/start-lesson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, lessonId })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function completeLesson(userId: string, lessonId: string): Promise<any> {
  const response = await fetch('/api/course-management/complete-lesson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, lessonId })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function getCourseProgress(userId: string, courseId: string): Promise<CourseProgress> {
  const response = await fetch('/api/course-management/course-progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, courseId })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const getAvailableLessonQuizzes = async (userId: string, lessonId: string): Promise<Quiz_lesson[]> => {
  try {
    const response = await fetch('/api/course-management/get-available-lesson-quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, lessonId })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch available quizzes')
    }

    const data = await response.json()

    if (!data.success || !data.quizzes || !Array.isArray(data.quizzes)) {
      return []
    }

    // Transform the data to match the Quiz_lesson interface
    const quizzes: Quiz_lesson[] = data.quizzes.map((quiz: QuizResponse) => ({
      id: quiz.id,
      title: quiz.title,
      is_timed: quiz.is_timed,
      duration: quiz.duration,
      max_attempts: quiz.max_attempts,
      question_count: quiz.question_count,
      attempts_taken: quiz.attempts_taken,
      question_types: quiz.question_types,
      questions: [] // We don't have the full question details in this response
    }))

    return quizzes
  } catch (error) {
    console.error('Error in getAvailableLessonQuizzes:', error)
    throw error
  }
}

export const startQuizAttempt = async (
  userId: string,
  quizId: string
): Promise<{
  success: boolean
  attempt_id: string
  questions: Question_lesson[]
  message?: string
}> => {
  const response = await fetch('/api/course-management/start-quiz-attempt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_user_id: userId, p_quiz_id: quizId })
  })

  if (!response.ok) {
    throw new Error('Failed to start quiz attempt')
  }

  return await response.json()
}

export const submitQuizAnswer = async (
  attemptId: string,
  questionId: string,
  answer: string,
  questionType: string
): Promise<{
  success: boolean
  message?: string
  data?: any
}> => {
  const response = await fetch('/api/course-management/submit-quiz-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      p_attempt_id: attemptId,
      p_question_id: questionId,
      p_answer: answer,
      p_question_type: questionType
    })
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to submit answer')
  }

  return result
}

export const submitQuiz = async (
  attemptId: string
): Promise<{
  success: boolean
  score: number
  total_questions: number
  message?: string
}> => {
  const response = await fetch('/api/course-management/submit-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_attempt_id: attemptId })
  })

  if (!response.ok) {
    throw new Error('Failed to submit quiz')
  }

  return await response.json()
}

export const getQuizProgress = async (
  userId: string,
  quizId: string
): Promise<{
  success: boolean
  attempt_id: string
  quiz_id: string
  started_at: string
  completed_at: string | null
  score: number | null
  answers: Record<string, { answer: any; is_correct: boolean | null }>
}> => {
  const response = await fetch('/api/course-management/get-quiz-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_user_id: userId, p_quiz_id: quizId })
  })

  if (!response.ok) {
    throw new Error('Failed to get quiz progress')
  }

  return await response.json()
}
