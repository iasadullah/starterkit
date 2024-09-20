import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { p_attempt_id } = await request.json()

  const { data, error } = await supabase.rpc('submit_quiz', {
    p_attempt_id
  })

  if (error) {
    console.error('Error submitting quiz:', error)

    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 })
  }

  return NextResponse.json(data)
}
