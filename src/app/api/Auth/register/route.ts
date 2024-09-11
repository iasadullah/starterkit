import { supabase } from '@/lib/supabaseClient'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) return res.status(400).json({ error: error.message })

    // Save additional user data (name) in the user_roles table
    const user = data.user
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ user_id: user?.id, role_id: 1, email, name }) // Default role: Guest (role_id: 1)

    if (insertError) return res.status(400).json({ error: insertError.message })

    return res.status(200).json({ message: 'User registered successfully!' })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
