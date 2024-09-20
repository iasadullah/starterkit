import { supabase } from '@/lib/supabaseClient'
import type { Progress } from '@/types/progressTypes'

export async function getUserCourseProgress(courseId: string): Promise<Progress> {
  const { data, error } = await supabase.rpc('get_user_course_progress', {
    p_course_id: courseId,
    p_user_id: 'current-user-id' // Replace with actual user ID
  })

  if (error) throw error

  return data
}
