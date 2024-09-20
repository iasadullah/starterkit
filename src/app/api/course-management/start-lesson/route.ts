import { NextResponse } from 'next/server'

import { cookies } from 'next/headers'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { userId, lessonId } = await request.json()

    if (!userId || !lessonId) {
      return NextResponse.json({ error: 'User ID and Lesson ID are required' }, { status: 400 })
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase.rpc('start_lesson', {
      p_user_id: userId,
      p_lesson_id: lessonId
    })

    if (error) {
      console.error('Error starting lesson:', error)

      return NextResponse.json({ error: 'Failed to start lesson' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in start-lesson API route:', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
