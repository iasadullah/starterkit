export enum UserRole {
  SUPER_ADMIN = 'superadmin', // Change this line
  TEACHER = 'teacher',
  STUDENT = 'student',
  GUEST = 'guest'
}

export const roleRoutes: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: ['/home', '/admin', '/teachers', '/students', '/courses'], // Update this line
  [UserRole.TEACHER]: ['/home', '/courses', '/students'],
  [UserRole.STUDENT]: ['/home', '/courses'],
  [UserRole.GUEST]: ['/home']
}
