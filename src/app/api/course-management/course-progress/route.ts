import { NextResponse } from 'next/server'

import { cookies } from 'next/headers'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { userId, courseId } = await request.json()

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 })
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase.rpc('get_course_progress', {
      p_user_id: userId,
      p_course_id: courseId
    })

    if (error) {
      console.error('Error fetching course progress:', error)

      return NextResponse.json({ error: 'Failed to fetch course progress' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in course-progress API route:', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
