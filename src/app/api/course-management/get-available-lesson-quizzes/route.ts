import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { userId, lessonId } = await request.json()

  const { data, error } = await supabase.rpc('get_available_lesson_quizzes', {
    p_user_id: userId,
    p_lesson_id: lessonId
  })

  if (error) {
    console.error('Error fetching available quizzes:', error)

    return NextResponse.json({ error: 'Failed to fetch available quizzes' }, { status: 500 })
  }

  return NextResponse.json(data)
}
