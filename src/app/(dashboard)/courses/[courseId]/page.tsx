// src/app/(dashboard)/courses/[courseId]/page.server.tsx

import React from 'react'

import { cookies } from 'next/headers'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import { getCourseDetails } from '@/services/coursedetails-ssr'
import type { CourseDetails } from '@/types/course-management/course'
import { UserRole } from '@/types/roles'

interface PageProps {
  params: { courseId: string }
  searchParams: { creator?: string }
}

export default async function CourseDetailPage({ params, searchParams }: PageProps) {
  const supabase = createServerComponentClient({ cookies })
  const { courseId } = params
  const creatorName = searchParams.creator || 'Unknown'

  // Fetch the session on the server
  const {
    data: { session }
  } = await supabase.auth.getSession()

  let courseDetails: CourseDetails | null = null
  let error: string | null = null

  try {
    courseDetails = await getCourseDetails(courseId)
  } catch (err) {
    error = 'Failed to fetch course details'
  }

  if (error) return <div>Error: {error}</div>
  if (!courseDetails) return <div>No course details found</div>

  // Determine user role
  const userData = session?.user?.user_metadata
  const userRole = (userData?.role?.role_name?.toLowerCase() || 'authenticated') as UserRole
  const canViewFullDetails = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.TEACHER

  return (
    <div className='container mx-auto px-4'>
      <h1 className='text-3xl font-bold mb-4'>{courseDetails.title}</h1>
      <p className='mb-4'>{courseDetails.description}</p>
      <p className='mb-4'>Category: {courseDetails.category}</p>
      <p className='mb-4'>Created by: {creatorName}</p>
      <p className='mb-4'>Created at: {new Date(courseDetails.created_at).toLocaleDateString()}</p>

      <h2 className='text-2xl font-bold mb-4'>Course Content</h2>
      <ul className='space-y-6'>
        {courseDetails.modules.map(module => (
          <li key={module.id} className='p-4 rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>{module.title}</h3>
            <p className='mb-4'>{module.description}</p>
            <ul className='list-disc list-inside space-y-2'>
              {module.lessons.map(lesson => (
                <li key={lesson.id}>
                  <span className='font-medium'>{lesson.title}</span>
                  {canViewFullDetails && (
                    <span className='ml-2 text-sm'>
                      {lesson.is_published ? (
                        <span className='text-green-600'>Published</span>
                      ) : (
                        <span className='text-yellow-600'>Not published</span>
                      )}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {!canViewFullDetails && (
        <div className='mt-8 p-4 bg-blue-100 rounded'>
          <p className='text-blue-800 font-semibold'>Enroll in this course to access full lesson content.</p>
        </div>
      )}
    </div>
  )
}
