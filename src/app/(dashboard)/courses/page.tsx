'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { getEnrolledCourses, getAllCourses, enrollInCourse } from '@/services/courseService'
import type { Course, EnrolledCourse } from '@/types/course-management/course'
import { CoursesView } from '@/views/course-management/CoursesView'

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      console.log('users::', user)
      setUser(user)
    }

    getUser()
  }, [supabase])

  useEffect(() => {
    async function fetchCourses() {
      if (!user) {
        console.log('No user found, skipping course fetch')
        setLoading(false)

        return
      }

      try {
        console.log('Fetching courses for user:', user.id)
        const [all, enrolled] = await Promise.all([getAllCourses(), getEnrolledCourses(user.id)])

        setAllCourses(all)
        setEnrolledCourses(enrolled)
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError('Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user])

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      console.log('No user found, cannot enroll')

      return
    }

    try {
      await enrollInCourse(user.id, courseId)
      console.log('Successfully enrolled in course:', courseId)

      // Refresh the courses after successful enrollment
      const [all, enrolled] = await Promise.all([getAllCourses(), getEnrolledCourses(user.id)])

      setAllCourses(all)
      setEnrolledCourses(enrolled)

      router.refresh()
    } catch (err) {
      console.error('Error enrolling in course:', err)
      setError('Failed to enroll in course')
    }
  }

  if (!user) return <div>Loading user...</div>
  if (loading) return <div>Loading courses...</div>
  if (error) return <div>Error: {error}</div>

  return <CoursesView allCourses={allCourses} enrolledCourses={enrolledCourses} onEnroll={handleEnroll} />
}
