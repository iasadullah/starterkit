import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  // Fetch data from the 'user_roles' table
  const { data: userRolesData, error: userRolesError } = await supabase
    .from('user_roles') // Specify the table name
    .select('*') // Select all columns from 'user_roles'
  console.log('userRolesData', userRolesData)
  // Handle error for 'user_roles' fetch
  if (userRolesError) {
    return NextResponse.json({ error: userRolesError.message }, { status: 500 })
  }

  // Fetch data from the 'roles' table
  const { data: rolesData, error: rolesError } = await supabase
    .from('roles') // Specify the table name
    .select('*') // Select all columns from 'roles'
  console.log('rolesData', rolesData)
  // Handle error for 'roles' fetch
  if (rolesError) {
    return NextResponse.json({ error: rolesError.message }, { status: 500 })
  }

  // Combine the user_roles data with the corresponding role_name from roles
  const combinedData = userRolesData.map(userRole => {
    const matchingRole = rolesData.find(role => role.id === userRole.role_id)
    console.log('matchingRole', matchingRole)
    return {
      ...userRole,
      role_name: matchingRole ? matchingRole.name : 'Unknown' // Add role_name to user_role data
    }
  })
  console.log('combinedData', combinedData)
  // Return the combined data
  return NextResponse.json(combinedData)
}
