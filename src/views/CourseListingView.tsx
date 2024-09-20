'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'

import { getAllCourses } from '@/app/api/Courses/courses'
import type { Course } from '@/types/courseListing'

export default function CourseListingView() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesData = await getAllCourses()

        setCourses(coursesData)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Available Courses</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {courses.map(course => (
          <Link href={`/courses/${course.course_id}`} key={course.course_id}>
            <div className='border p-4 rounded-lg hover:shadow-lg transition-shadow'>
              <h3 className='text-xl font-semibold'>{course.title}</h3>
              <p className='text-gray-600'>{course.description}</p>
              <p className='text-sm text-gray-500 mt-2'>By {course.creator_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
