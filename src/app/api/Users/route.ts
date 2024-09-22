import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: userRolesData, error: userRolesError } = await supabase.from('user_roles').select('*')
  if (userRolesError) {
    return NextResponse.json({ error: userRolesError.message }, { status: 500 })
  }

  const { data: rolesData, error: rolesError } = await supabase.from('roles').select('*')
  if (rolesError) {
    return NextResponse.json({ error: rolesError.message }, { status: 500 })
  }
  const combinedData = userRolesData.map(userRole => {
    const matchingRole = rolesData.find(role => role.id === userRole.role_id)
    return {
      ...userRole,
      role_name: matchingRole ? matchingRole.name : 'Unknown'
    }
  })
  return NextResponse.json(combinedData)
}
