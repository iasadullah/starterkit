import { supabase } from '@/lib/supabaseClient'
import type { LessonDetails } from '@/types/lessonTypes'

export async function getLessonDetails(courseId: string, lessonId: string): Promise<LessonDetails> {
  const { data, error } = await supabase.rpc('get_lesson_details', {
    p_course_id: courseId,
    p_lesson_id: lessonId,
    p_user_id: 'current-user-id' // Replace with actual user ID
  })

  if (error) throw error

  return data
}

export async function updateLessonProgress(
  courseId: string,
  lessonId: string,
  progress: number,
  isCompleted: boolean
): Promise<void> {
  const { error } = await supabase.rpc('update_lesson_progress', {
    p_user_id: 'current-user-id', // Replace with actual user ID
    p_course_id: courseId,
    p_lesson_id: lessonId,
    p_progress: progress,
    p_is_completed: isCompleted
  })

  if (error) throw error
}
