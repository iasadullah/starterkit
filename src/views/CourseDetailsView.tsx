'use client'

import { useState, useEffect } from 'react'

import { getCourseDetails, enrollUserInCourse } from '@/app/api/Courses/courses'
import type { CourseDetails } from '@/types/courseListing'
import UserProgress from '@components/UserProgress'

interface CourseDetailsViewProps {
  courseId: string
}

export default function CourseDetailsView({ courseId }: CourseDetailsViewProps) {
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null)

  const userData = JSON.parse(localStorage.getItem('userData') || '{}')

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const details = await getCourseDetails(courseId)

        console.log('Fetched course details:', details) // Added log
        setCourseDetails(details)
      } catch (error) {
        console.error('Error fetching course details:', error)
      }
    }

    fetchCourseDetails()
  }, [courseId])

  async function handleEnroll() {
    if (!courseDetails) {
      console.error('Course details not loaded yet')

      return
    }

    if (!courseDetails.course_id) {
      console.error('Course ID is missing from course details')

      return
    }

    try {
      console.log('Enrolling:', courseDetails.course_id, userData.user.id)
      await enrollUserInCourse(courseDetails.course_id, userData.user.id)

      // Refresh course details to update enrollment status
      const updatedDetails = await getCourseDetails(courseDetails.course_id)

      setCourseDetails(updatedDetails)
    } catch (error) {
      console.error('Error enrolling in course:', error)
    }
  }

  if (!courseDetails) return <div>Loading...</div>

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>{courseDetails.title}</h2>
      <p className='text-gray-600 mb-4'>{courseDetails.description}</p>
      {!courseDetails.is_enrolled && (
        <button onClick={handleEnroll} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
          Enroll Now
        </button>
      )}
      {courseDetails.is_enrolled && <UserProgress courseId={courseDetails.course_id} />}
      <div className='mt-8'>
        {courseDetails.modules.map(module => (
          <div key={module.id} className='mb-6'>
            <h3 className='text-xl font-semibold mb-2'>{module.title}</h3>
            <p className='text-gray-600 mb-2'>{module.description}</p>
            <ul className='list-disc pl-5'>
              {module.lessons.map(lesson => (
                <li key={lesson.id} className={`mb-1 ${!courseDetails.is_enrolled && 'text-gray-400'}`}>
                  {lesson.title}
                  {!courseDetails.is_enrolled && ' (Locked)'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
