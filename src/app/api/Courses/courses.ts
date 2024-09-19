import type { Course, CourseDetails } from '@/types/courseListing'

import { supabase } from '@/lib/supabaseClient'

export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase.rpc('get_all_courses')

  if (error) throw error

  return data
}

export async function getCourseDetails(courseId: string): Promise<CourseDetails> {
  const { data, error } = await supabase.rpc('get_lesson_details_by_id', {
    course_id: courseId
  })

  if (error) throw error

  return data
}

export async function enrollUserInCourse(courseId: string, userId: string): Promise<void> {
  const { error } = await supabase.rpc('enroll_user_in_course', {
    p_user_id: userId,
    p_course_id: courseId
  })

  if (error) throw error
}
