// src/types/roles.ts

export enum UserRole {
  SUPER_ADMIN = 'superadmin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  GUEST = 'guest'
}

export const roleRoutes: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: ['/home', '/admin', '/teachers', '/students', '/courses'],
  [UserRole.TEACHER]: ['/home', '/courses', '/students'],
  [UserRole.STUDENT]: ['/home', '/courses', '/enrolled-course', '/ai-wizard'],
  [UserRole.GUEST]: ['/home']
}

// Routes that require elevated permissions (accessible by SUPER_ADMIN and TEACHER)
export const elevatedRoutes = ['/courses/create']

// Roles that can access elevated routes
export const elevatedRoles = ['superadmin', 'teacher']
