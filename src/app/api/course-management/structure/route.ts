import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { courseId } = await request.json()

    // Check if user is authenticated
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase.rpc('get_course_structure', {
      p_course_id: courseId,
      p_user_id: user.id
    })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching course structure:', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
