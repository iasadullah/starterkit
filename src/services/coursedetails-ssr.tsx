// src/services/courseService.ts

import { cookies } from 'next/headers'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import type { CourseDetails } from '@/types/course-management/course'

export async function getCourseDetails(courseId: string): Promise<CourseDetails> {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.rpc('get_course_details', {
    course_id: courseId
  })

  if (error) {
    throw new Error('Failed to fetch course details')
  }

  return data
}
