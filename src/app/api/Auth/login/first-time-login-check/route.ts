import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('id')
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required', status: 'error' }, { status: 400 })
  }
  const supabase = createRouteHandlerClient({ cookies })
  const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', userId).single()
  if (!userData) {
    return NextResponse.json(
      {
        message: 'First-time login. Please complete your profile.',
        status: 'first-time',
        nextSteps: 'Complete profile information'
      },
      { status: 200 }
    )
  }

  //   const isProfileComplete = userData.profile_complete || false // assuming there's a 'profile_complete' field

  //   // If profile is not complete, guide the user to complete their profile
  //   if (!isProfileComplete) {
  //     return NextResponse.json(
  //       {
  //         message: 'Profile incomplete. Please complete your profile to proceed.',
  //         status: 'incomplete-profile',
  //         userData, // Pass user data to the response to guide further actions
  //         nextSteps: 'Complete your profile information'
  //       },
  //       { status: 200 }
  //     )
  //   }

  return NextResponse.json(
    {
      message: 'User already logged in.',
      status: 'logged-in',
      userData
    },
    { status: 200 }
  )
}
