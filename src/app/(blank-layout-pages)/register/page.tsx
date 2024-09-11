// Next Imports
import type { Metadata } from 'next'

// Component Imports
import RegisterV2 from '@views/Register'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register your account'
}

const RegisterV2Page = () => {
  // Vars
  const mode = getServerMode()

  return <RegisterV2 mode={mode} />
}

export default RegisterV2Page
