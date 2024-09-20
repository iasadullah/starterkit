import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { p_attempt_id, p_question_id, p_answer } = await request.json()

  try {
    const { data, error } = await supabase.rpc('submit_quiz_answer', {
      p_attempt_id,
      p_question_id,
      p_answer
    })

    if (error) {
      console.error('Error submitting quiz answer:', error)

      return NextResponse.json(
        { success: false, message: `Error submitting answer: ${error.message}` },
        { status: 400 }
      )
    }

    // If the RPC function returns a success flag, use it
    if (data && typeof data === 'object' && 'success' in data) {
      return NextResponse.json(data)
    }

    // If no specific success flag, assume success if we got here
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Unexpected error submitting quiz answer:', error)

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred while submitting the answer' },
      { status: 500 }
    )
  }
}
