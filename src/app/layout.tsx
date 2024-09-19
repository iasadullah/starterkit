// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import { cookies } from 'next/headers'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Materio - Material Design Next.js Admin Template',
  description:
    'Materio - Material Design Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
}

const RootLayout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  // Initialize Supabase client
  const supabase = createServerComponentClient({ cookies })

  // Get the user's session
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
