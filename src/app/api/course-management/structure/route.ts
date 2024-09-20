import { NextResponse } from 'next/server'

import { cookies } from 'next/headers'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase.rpc('get_course_structure', {
      p_course_id: courseId,
      p_user_id: user.id
    })

    if (error) {
      console.error('Error fetching course structure:', error)

      return NextResponse.json({ error: 'Failed to fetch course structure' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in structure API route:', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
